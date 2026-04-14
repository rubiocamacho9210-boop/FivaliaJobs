import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async addFavorite(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      throw new ConflictException('Post already in favorites');
    }

    return this.prisma.favorite.create({
      data: { userId, postId },
    });
  }

  async removeFavorite(userId: string, postId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    return this.prisma.favorite.delete({
      where: { userId_postId: { userId, postId } },
    });
  }

  async getMyFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          include: {
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
          },
        },
      },
    });
  }

  async isFavorite(userId: string, postId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    return !!favorite;
  }
}
