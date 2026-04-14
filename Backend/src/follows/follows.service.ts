import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new ConflictException('Cannot follow yourself');
    }

    const userToFollow = await this.prisma.user.findUnique({ where: { id: followingId } });
    if (!userToFollow) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (existing) {
      throw new ConflictException('Already following this user');
    }

    return this.prisma.follow.create({
      data: { followerId, followingId },
    });
  }

  async unfollow(followerId: string, followingId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    return this.prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } },
    });
  }

  async getFollowing(userId: string) {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            role: true,
            rating: true,
            ratingCount: true,
            profile: {
              select: {
                bio: true,
                category: true,
                location: true,
                photoUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async getFollowers(userId: string) {
    return this.prisma.follow.findMany({
      where: { followingId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            role: true,
            rating: true,
            ratingCount: true,
            profile: {
              select: {
                bio: true,
                category: true,
                location: true,
                photoUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async isFollowing(followerId: string, followingId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    return !!follow;
  }

  async getFollowCounts(userId: string) {
    const [following, followers] = await Promise.all([
      this.prisma.follow.count({ where: { followerId: userId } }),
      this.prisma.follow.count({ where: { followingId: userId } }),
    ]);
    return { following, followers };
  }
}
