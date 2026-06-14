import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// `@Global()` — PrismaService bisa langsung di inject ke module mana aja tanpa perlu import ulang
// `exports: [PrismaService]` — biar bisa dipake di module lain

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
