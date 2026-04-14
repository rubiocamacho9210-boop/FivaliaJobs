import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':postId')
  addFavorite(
    @CurrentUser() user: AuthenticatedUser,
    @Param('postId') postId: string,
  ) {
    return this.favoritesService.addFavorite(user.id, postId);
  }

  @Delete(':postId')
  removeFavorite(
    @CurrentUser() user: AuthenticatedUser,
    @Param('postId') postId: string,
  ) {
    return this.favoritesService.removeFavorite(user.id, postId);
  }

  @Get()
  getMyFavorites(@CurrentUser() user: AuthenticatedUser) {
    return this.favoritesService.getMyFavorites(user.id);
  }
}
