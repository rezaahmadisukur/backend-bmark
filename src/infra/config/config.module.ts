import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

// `NestConfigModule.forRoot()` — baca file `.env` dan inject ke seluruh app
// `{ isGlobal: true }` — jadi gak perlu import ulang di module lain
@Module({
  imports: [NestConfigModule.forRoot({ isGlobal: true })],
})
export class ConfigModule {}
