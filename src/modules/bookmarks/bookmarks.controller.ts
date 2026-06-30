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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'Get all bookmarks',
    description: 'Return all bookmarks belonging to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmarks retrieved successfully',
  })
  findAll(@CurrentUser() user: JwtUser) {
    return this.bookmarksService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get detail by ID',
    description:
      'Returns a specific bookmark if it belongs to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmark found',
  })
  @ApiResponse({
    status: 404,
    description: 'Bookmark not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Bookmark does not belong to user',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.bookmarksService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new bookmark',
    description: 'Create a new bookmark for the authenticated user',
  })
  @ApiResponse({
    status: 201,
    description: 'Bookmark created successfully',
  })
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.bookmarksService.create(createBookmarkDto, user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update bookmark',
    description: 'Update a bookmark if it belongs to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmark updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Bookmark not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Bookmark does not belong to user',
  })
  update(
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.bookmarksService.update(id, updateBookmarkDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete the bookmark',
    description: 'Delete a bookmark if it belongs to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmark deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Bookmark not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Bookmark does not belong to user',
  })
  delete(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.bookmarksService.delete(id, user.id);
  }
}
