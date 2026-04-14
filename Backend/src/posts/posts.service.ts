import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostType, PostStatus } from '@prisma/client';

const MAX_PAGE_LIMIT = 50;

const postAuthorSelect = {
  user: {
    select: {
      id: true,
      name: true,
      role: true,
      rating: true,
      ratingCount: true,
      profile: {
        select: {
          location: true,
          contact: true,
          photoUrl: true,
        },
      },
    },
  },
};

export type PostFilters = {
  type?: PostType;
  category?: string;
  search?: string;
  location?: string;
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

  async findAll(page: number, limit: number, filters?: PostFilters) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), MAX_PAGE_LIMIT);
    const skip = (safePage - 1) * safeLimit;

    const where: any = { status: 'ACTIVE' };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.category) {
      where.category = {
        contains: filters.category,
        mode: 'insensitive',
      };
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { category: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.location) {
      where.user = {
        profile: {
          location: {
            contains: filters.location,
            mode: 'insensitive',
          },
        },
      };
    }

    return this.prisma.post.findMany({
      where,
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

  async updatePost(postId: string, requestingUserId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== requestingUserId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    if (post.status !== 'ACTIVE') {
      throw new ForbiddenException('You can only update active posts');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        ...(dto.type && { type: dto.type }),
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
        ...(dto.category && { category: dto.category }),
      },
    });
  }

  async deletePost(postId: string, requestingUserId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== requestingUserId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({ where: { id: postId } });

    return { success: true };
  }
}
