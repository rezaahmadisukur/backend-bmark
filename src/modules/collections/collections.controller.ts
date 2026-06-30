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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  findAll(@CurrentUser() user: JwtUser) {
    return this.collectionsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.collectionsService.findOne(id, user.id);
  }

  @Post()
  create(
    @Body() createCollectionDto: CreateCollectionDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.collectionsService.create(createCollectionDto, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    updateCollectionDto: UpdateCollectionDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.collectionsService.update(id, updateCollectionDto, user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.collectionsService.delete(id, user.id);
  }
}
