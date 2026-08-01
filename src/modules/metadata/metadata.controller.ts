import { Controller, Get, Query } from '@nestjs/common';
import { MetadataService } from './metadata.service';

@Controller('metadata')
export class MetadataController {
  constructor(readonly metadataService: MetadataService) {}

  @Get()
  async getMetadata(@Query('url') url: string) {
    return this.metadataService.fetchMetadata(url);
  }
}
