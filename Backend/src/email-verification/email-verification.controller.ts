import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { EmailVerificationService } from './email-verification.service';

class VerifyCodeDto {
  code: string;
}

@Controller('email-verification')
@UseGuards(JwtAuthGuard)
export class EmailVerificationController {
  constructor(private readonly emailVerificationService: EmailVerificationService) {}

  @Post('send-code')
  async sendCode(@CurrentUser() user: AuthenticatedUser) {
    await this.emailVerificationService.generateAndSendCode(user.id);
    return { message: 'Verification code sent' };
  }

  @Post('verify')
  async verifyCode(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: VerifyCodeDto,
  ) {
    const success = await this.emailVerificationService.verifyCode(user.id, dto.code);
    return { success };
  }
}
