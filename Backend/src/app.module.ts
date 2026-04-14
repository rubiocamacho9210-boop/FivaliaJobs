import { Module } from '@nestjs/common';
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
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, AuthModule, ProfileModule, PostsModule, InterestsModule, FavoritesModule, FollowsModule, ReviewsModule, ReportsModule, NotificationsModule, HealthModule],
})
export class AppModule {}
