import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterestDto } from './dto/create-interest.dto';

const MAX_PAGE_LIMIT = 50;

@Injectable()
export class InterestsService {
  constructor(private readonly prisma: PrismaService) {}

  async createInterest(fromUserId: string, dto: CreateInterestDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: dto.postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.status === 'CLOSED') {
      throw new BadRequestException('Cannot express interest in a closed post');
    }

    if (post.userId === fromUserId) {
      throw new BadRequestException('You cannot express interest in your own post');
    }

    try {
      return await this.prisma.interest.create({
        data: { fromUserId, postId: dto.postId },
      });
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new ConflictException('You have already expressed interest in this post');
      }
      throw error;
    }
  }

  async findMyInterests(userId: string, page: number, limit: number) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), MAX_PAGE_LIMIT);
    const skip = (safePage - 1) * safeLimit;

    return this.prisma.interest.findMany({
      where: { fromUserId: userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: safeLimit,
      include: {
        post: {
          select: {
            id: true,
            title: true,
            type: true,
            category: true,
            status: true,
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async findInterestsByPost(postId: string, requestingUserId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== requestingUserId) {
      throw new ForbiddenException('Only the post owner can view its interests');
    }

    return this.prisma.interest.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      include: {
        fromUser: {
          select: { id: true, name: true, role: true },
        },
      },
    });
  }
}
