import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { PostsModule } from './posts/posts.module';
import { InterestsModule } from './interests/interests.module';
import { FavoritesModule } from './favorites/favorites.module';
import { FollowsModule } from './follows/follows.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,   // 1 second window
        limit: 10,   // max 10 requests/second per IP
      },
      {
        name: 'medium',
        ttl: 60_000, // 1 minute window
        limit: 100,  // max 100 requests/minute per IP
      },
    ]),
    PrismaModule,
    AuthModule,
    ProfileModule,
    PostsModule,
    InterestsModule,
    FavoritesModule,
    FollowsModule,
    ReviewsModule,
    ReportsModule,
    NotificationsModule,
    EmailVerificationModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
