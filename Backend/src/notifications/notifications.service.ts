import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type Notification = {
  id: string;
  type: 'INTEREST' | 'FOLLOW' | 'REVIEW';
  title: string;
  message: string;
  data?: Record<string, string>;
  createdAt: string;
  read: boolean;
};

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getNotifications(userId: string, limit: number = 20) {
    const notifications: Notification[] = [];

    const [interests, followers, reviews] = await Promise.all([
      this.prisma.interest.findMany({
        where: { post: { userId } },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          fromUser: { select: { id: true, name: true } },
          post: { select: { id: true, title: true } },
        },
      }),
      this.prisma.follow.findMany({
        where: { followingId: userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          follower: { select: { id: true, name: true } },
        },
      }),
      this.prisma.review.findMany({
        where: { toUserId: userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          fromUser: { select: { id: true, name: true } },
          post: { select: { id: true, title: true } },
        },
      }),
    ]);

    interests.forEach((interest) => {
      notifications.push({
        id: `interest-${interest.id}`,
        type: 'INTEREST',
        title: 'New interest',
        message: `${interest.fromUser.name} is interested in your post "${interest.post.title}"`,
        data: { postId: interest.post.id, userId: interest.fromUser.id },
        createdAt: interest.createdAt.toISOString(),
        read: false,
      });
    });

    followers.forEach((follow) => {
      notifications.push({
        id: `follow-${follow.id}`,
        type: 'FOLLOW',
        title: 'New follower',
        message: `${follow.follower.name} started following you`,
        data: { userId: follow.follower.id },
        createdAt: follow.createdAt.toISOString(),
        read: false,
      });
    });

    reviews.forEach((review) => {
      notifications.push({
        id: `review-${review.id}`,
        type: 'REVIEW',
        title: 'New review',
        message: `${review.fromUser.name} left you a ${review.rating}-star review for "${review.post.title}"`,
        data: { postId: review.post.id, userId: review.fromUser.id },
        createdAt: review.createdAt.toISOString(),
        read: false,
      });
    });

    return notifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getUnreadCount(userId: string): Promise<number> {
    const [interestsCount, followersCount, reviewsCount] = await Promise.all([
      this.prisma.interest.count({
        where: { post: { userId } },
      }),
      this.prisma.follow.count({
        where: { followingId: userId },
      }),
      this.prisma.review.count({
        where: { toUserId: userId },
      }),
    ]);

    return interestsCount + followersCount + reviewsCount;
  }
}
