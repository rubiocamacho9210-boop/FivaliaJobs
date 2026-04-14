import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { PostsModule } from './posts/posts.module';
import { InterestsModule } from './interests/interests.module';
import { FavoritesModule } from './favorites/favorites.module';
import { FollowsModule } from './follows/follows.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, AuthModule, ProfileModule, PostsModule, InterestsModule, FavoritesModule, FollowsModule, HealthModule],
})
export class AppModule {}
