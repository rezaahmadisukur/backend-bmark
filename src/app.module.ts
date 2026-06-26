import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { ConfigModule } from './infra/config/config.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { TagsModule } from './modules/tags/tags.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    BookmarksModule,
    CollectionsModule,
    TagsModule,
  ],
})
export class AppModule {}
