import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { ConfigModule } from './infra/config/config.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { CollectionsModule } from './modules/collections/collections.module';

@Module({
  imports: [ConfigModule, PrismaModule, BookmarksModule, CollectionsModule],
})
export class AppModule {}
