import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const VERIFICATION_CODE_LENGTH = 6;
const CODE_EXPIRY_MINUTES = 15;

@Injectable()
export class EmailVerificationService {
  constructor(private readonly prisma: PrismaService) {}

  private generateCode(): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  }

  async generateAndSendCode(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const code = this.generateCode();
    const expiry = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationCode: code,
        emailVerificationExpiry: expiry,
      },
    });

    await this.sendVerificationEmail(user.email, user.name, code);
  }

  async verifyCode(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    if (!user.emailVerificationCode || !user.emailVerificationExpiry) {
      throw new BadRequestException('No verification code found. Please request a new one.');
    }

    if (new Date() > user.emailVerificationExpiry) {
      throw new BadRequestException('Verification code expired. Please request a new one.');
    }

    if (user.emailVerificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        emailVerificationCode: null,
        emailVerificationExpiry: null,
      },
    });

    return true;
  }

  private async sendVerificationEmail(email: string, name: string, code: string): Promise<void> {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'FivaliaJobs <noreply@fivaliajobs.com>',
        to: email,
        subject: 'Verify your FivaliaJobs email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6366f1;">Welcome to FivaliaJobs!</h1>
            <p>Hi ${name},</p>
            <p>Your verification code is:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 8px; border-radius: 8px; margin: 20px 0;">
              <strong>${code}</strong>
            </div>
            <p>This code expires in 15 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      console.log(`[DEV] Verification code for ${email}: ${code}`);
    }
  }
}
