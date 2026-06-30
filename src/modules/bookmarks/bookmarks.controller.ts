import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type JwtUser } from '../auth/strategies/jwt.strategy';

@ApiTags('Bookmarks')
@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.bookmarksService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.bookmarksService.findOne(id, user.id);
  }

  @Post()
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.bookmarksService.create(createBookmarkDto, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.bookmarksService.update(id, updateBookmarkDto, user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.bookmarksService.delete(id, user.id);
  }
}
