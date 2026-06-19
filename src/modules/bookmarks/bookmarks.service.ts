import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.bookmark.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.bookmark.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(createBookmarkDto: CreateBookmarkDto) {
    return this.prismaService.bookmark.create({
      data: {
        url: createBookmarkDto.url,
        title: createBookmarkDto.title,
        description: createBookmarkDto.description,
        userId: 'temp-user-id',
      },
    });
  }

  async update(id: string, updateBookmarkDto: UpdateBookmarkDto) {
    return this.prismaService.bookmark.update({
      where: {
        id: id,
      },
      data: updateBookmarkDto,
    });
  }

  async delete(id: string) {
    return this.prismaService.bookmark.delete({
      where: {
        id: id,
      },
    });
  }
}
