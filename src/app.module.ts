import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './infra/prisma/prisma.module';
import { ConfigModule } from './infra/config/config.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { TagsModule } from './modules/tags/tags.module';
import { AuthModule } from './modules/auth/auth.module';
import { MetadataModule } from './modules/metadata/metadata.module';
import { AppThrottlerGuard } from './common/guards/throttler.guard';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    // Rate limiting global: default 100 request per 60 detik per IP.
    // Endpoint sensitif bisa di-override dengan @Throttle() di controller.
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000, // dalam milidetik = 60 detik
        limit: 100,
      },
    ]),
    AuthModule,
    BookmarksModule,
    CollectionsModule,
    TagsModule,
    MetadataModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
  ],
})
export class AppModule {}
