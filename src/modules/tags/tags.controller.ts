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
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tags')
@Controller('tags')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tags',
    description:
      'Returns all available tags (global tags shared across all user)',
  })
  @ApiResponse({
    status: 200,
    description: 'Tags retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get tag by ID',
    description: 'Returns a specific tag by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Tag found',
  })
  @ApiResponse({
    status: 404,
    description: 'Tag not found',
  })
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new tag',
    description: 'Create a new global tag (requires authentication)',
  })
  @ApiResponse({
    status: 201,
    description: 'Tag created successfully',
  })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update tag',
    description: 'Update an existing tag (requires authentication)',
  })
  @ApiResponse({
    status: 200,
    description: 'Tag updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Tag not found',
  })
  update(@Param('id') id: string, updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete tag',
    description: 'Delete a tag (requires authentication)',
  })
  @ApiResponse({
    status: 200,
    description: 'Tag deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Tag not found',
  })
  delete(@Param('id') id: string) {
    return this.tagsService.delete(id);
  }
}
