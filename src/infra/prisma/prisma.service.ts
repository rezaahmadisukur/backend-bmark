import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// `extends PrismaClient` — ngambil semua method Prisma (find, create, dll)
// `implements OnModuleInit` — NestJS akan otomatis panggil `onModuleInit()` pas aplikasi start
// `this.$connect()` — koneksi ke database

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    super({ adapter });
  }
}
