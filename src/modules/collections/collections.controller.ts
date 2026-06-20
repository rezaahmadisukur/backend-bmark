import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  findAll() {
    return this.collectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(id);
  }

  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(createCollectionDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, updateCollectionDto: UpdateCollectionDto) {
    return this.collectionsService.update(id, updateCollectionDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.collectionsService.delete(id);
  }
}
