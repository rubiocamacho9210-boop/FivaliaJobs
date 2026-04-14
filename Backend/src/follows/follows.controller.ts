import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { FollowsService } from './follows.service';

@Controller('follows')
@UseGuards(JwtAuthGuard)
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':userId')
  follow(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') followingId: string,
  ) {
    return this.followsService.follow(user.id, followingId);
  }

  @Delete(':userId')
  unfollow(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') followingId: string,
  ) {
    return this.followsService.unfollow(user.id, followingId);
  }

  @Get('following')
  getFollowing(@CurrentUser() user: AuthenticatedUser) {
    return this.followsService.getFollowing(user.id);
  }

  @Get('followers')
  getFollowers(@CurrentUser() user: AuthenticatedUser) {
    return this.followsService.getFollowers(user.id);
  }

  @Get('counts')
  getFollowCounts(@CurrentUser() user: AuthenticatedUser) {
    return this.followsService.getFollowCounts(user.id);
  }
}
