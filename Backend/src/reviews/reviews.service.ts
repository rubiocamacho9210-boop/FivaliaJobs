import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(fromUserId: string, dto: CreateReviewDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: dto.postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.status !== 'CLOSED') {
      throw new BadRequestException('You can only review after the post is closed');
    }

    if (post.userId === fromUserId && dto.toUserId === fromUserId) {
      throw new BadRequestException('You cannot review yourself');
    }

    const interest = await this.prisma.interest.findUnique({
      where: {
        fromUserId_postId: {
          fromUserId: dto.toUserId,
          postId: dto.postId,
        },
      },
    });

    if (!interest && post.userId !== fromUserId && post.userId !== dto.toUserId) {
      throw new BadRequestException('Only participants of the post can leave reviews');
    }

    try {
      const review = await this.prisma.review.create({
        data: {
          fromUserId,
          toUserId: dto.toUserId,
          postId: dto.postId,
          rating: dto.rating,
          comment: dto.comment,
          type: dto.type,
        },
      });

      const userReviews = await this.prisma.review.aggregate({
        where: { toUserId: dto.toUserId },
        _avg: { rating: true },
        _count: true,
      });

      await this.prisma.user.update({
        where: { id: dto.toUserId },
        data: {
          rating: userReviews._avg.rating || 0,
          ratingCount: userReviews._count,
        },
      });

      return review;
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new ConflictException('You have already reviewed this post');
      }
      throw error;
    }
  }

  async findReviewsForUser(userId: string) {
    return this.prisma.review.findMany({
      where: { toUserId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            rating: true,
            ratingCount: true,
            profile: {
              select: {
                photoUrl: true,
              },
            },
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
    });
  }

  async findReviewsGivenByUser(userId: string) {
    return this.prisma.review.findMany({
      where: { fromUserId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        toUser: {
          select: {
            id: true,
            name: true,
            rating: true,
            ratingCount: true,
            profile: {
              select: {
                photoUrl: true,
              },
            },
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
    });
  }
}
