import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(fromUserId: string, dto: CreateReportDto) {
    if (dto.targetType === 'REPORT_POST') {
      const post = await this.prisma.post.findUnique({
        where: { id: dto.targetId },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }
    } else if (dto.targetType === 'REPORT_USER') {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.targetId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    try {
      return await this.prisma.report.create({
        data: {
          fromUserId,
          targetType: dto.targetType,
          targetId: dto.targetId,
          reason: dto.reason,
          details: dto.details,
        },
      });
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new ConflictException('You have already reported this content');
      }
      throw error;
    }
  }
}
