import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';

const MAX_PAGE_LIMIT = 50;

const postAuthorSelect = {
  user: {
    select: { id: true, name: true, role: true },
  },
};

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(userId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        userId,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        category: dto.category,
      },
    });
  }

  async findAll(page: number, limit: number) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), MAX_PAGE_LIMIT);
    const skip = (safePage - 1) * safeLimit;

    return this.prisma.post.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      skip,
      take: safeLimit,
      include: postAuthorSelect,
    });
  }

  async findById(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: postAuthorSelect,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async findByUserId(userId: string) {
    return this.prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(postId: string, requestingUserId: string, dto: UpdatePostStatusDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== requestingUserId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: { status: dto.status },
    });
  }
}
