import { Controller, Get, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { MetadataService } from './metadata.service';

@Controller('metadata')
export class MetadataController {
  constructor(readonly metadataService: MetadataService) {}

  // Limit lebih ketat: endpoint ini memicu request HTTP ke URL eksternal,
  // jadi rentan disalahgunakan untuk spam/spider.
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  @Get()
  async getMetadata(@Query('url') url: string) {
    return this.metadataService.fetchMetadata(url);
  }
}
