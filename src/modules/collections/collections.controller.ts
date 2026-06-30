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
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type JwtUser } from '../auth/strategies/jwt.strategy';

@ApiTags('Collections')
@Controller('collections')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all collections',
    description: 'Return all collections belonging to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Collections retrieved successfully',
  })
  findAll(@CurrentUser() user: JwtUser) {
    return this.collectionsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get collection by ID',
    description:
      'Returns a specific collection if it belongs to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Collection found',
  })
  @ApiResponse({
    status: 404,
    description: 'Collection not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Collection does not belong to user',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.collectionsService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new collection',
    description: 'Create a new collection for the authenticated user',
  })
  @ApiResponse({
    status: 201,
    description: 'Collection created successfully',
  })
  create(
    @Body() createCollectionDto: CreateCollectionDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.collectionsService.create(createCollectionDto, user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update collection',
    description: 'Update a collection if it belongs to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Collection updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Collection not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Collection does not belong to user',
  })
  update(
    @Param('id') id: string,
    updateCollectionDto: UpdateCollectionDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.collectionsService.update(id, updateCollectionDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete collection',
    description: 'Delete a collection if it belongs to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Collection deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Collection not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Collection does not belong to user',
  })
  delete(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.collectionsService.delete(id, user.id);
  }
}
