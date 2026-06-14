import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { ConfigModule } from './infra/config/config.module';

@Module({
  imports: [ConfigModule, PrismaModule],
})
export class AppModule {}
