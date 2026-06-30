import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly bookmarkSelect = {
    id: true,
    url: true,
    title: true,
    description: true,
    favicon: true,
    isFavorite: true,
    createdAt: true,
    updatedAt: true,
    userId: true, // Tambah userId untuk authorization check
  } as const;

  async findAll(userId: string) {
    return this.prismaService.bookmark.findMany({
      where: {
        userId: userId,
      },
      select: this.bookmarkSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: id,
      },
      select: this.bookmarkSelect,
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    if (bookmark.userId !== userId) {
      throw new ForbiddenException('You do not have access to this bookmark');
    }

    return bookmark;
  }

  async create(createBookmarkDto: CreateBookmarkDto, userId: string) {
    return this.prismaService.bookmark.create({
      data: {
        ...createBookmarkDto,
        userId,
      },
      select: this.bookmarkSelect,
    });
  }

  async update(
    id: string,
    updateBookmarkDto: UpdateBookmarkDto,
    userId: string,
  ) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: id,
      },
      select: {
        userId: true,
      },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    if (bookmark.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this bookmark',
      );
    }

    return this.prismaService.bookmark.update({
      where: {
        id: id,
      },
      data: updateBookmarkDto,
      select: this.bookmarkSelect,
    });
  }

  async delete(id: string, userId: string) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: id,
      },
      select: {
        userId: true,
      },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    if (bookmark.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this bookmark',
      );
    }

    return this.prismaService.bookmark.delete({
      where: {
        id: id,
      },
      select: this.bookmarkSelect,
    });
  }
}
