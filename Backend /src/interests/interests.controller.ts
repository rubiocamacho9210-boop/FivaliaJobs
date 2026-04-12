import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';

@Controller('interests')
@UseGuards(JwtAuthGuard)
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  createInterest(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateInterestDto,
  ) {
    return this.interestsService.createInterest(user.id, dto);
  }

  @Get('me')
  findMyInterests(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.interestsService.findMyInterests(user.id, page, limit);
  }

  @Get('post/:postId')
  findInterestsByPost(
    @Param('postId') postId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.interestsService.findInterestsByPost(postId, user.id);
  }
}
