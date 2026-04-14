import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, role: true, rating: true, ratingCount: true },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async upsertProfile(userId: string, dto: UpdateProfileDto) {
    const data = {
      ...(dto.bio !== undefined && { bio: dto.bio }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.location !== undefined && { location: dto.location }),
      ...(dto.contact !== undefined && { contact: dto.contact }),
      ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
    };

    return this.prisma.profile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }
}
