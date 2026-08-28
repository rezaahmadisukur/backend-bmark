import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

type FindAllOptions = {
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'az';
};

@Injectable()
export class BookmarksService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly bookmarkSelect = {
    id: true,
    url: true,
    title: true,
    description: true,
    image: true,
    favicon: true,
    isFavorite: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
    collectionId: true,
    tags: {
      select: {
        tag: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    },
  } as const;

  async findAll(userId: string, options: FindAllOptions = {}) {
    const { search, page, limit, sort } = options;

    const where: Prisma.BookmarkWhereInput = {
      userId: userId,
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                url: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    const orderBy: Prisma.BookmarkOrderByWithRelationInput =
      sort === 'oldest'
        ? {
            createdAt: 'asc',
          }
        : sort === 'az'
          ? {
              title: 'asc',
            }
          : {
              createdAt: 'desc',
            };

    // Mode paginated: hanya jika page/limit dikirim
    if (page !== undefined || limit !== undefined) {
      const take = limit ?? 20;
      const skip = ((page ?? 1) - 1) * take;

      const [data, total] = await Promise.all([
        this.prismaService.bookmark.findMany({
          where: where,
          select: this.bookmarkSelect,
          orderBy: orderBy,
          skip: skip,
          take: take,
        }),
        this.prismaService.bookmark.count({ where: where }),
      ]);

      return {
        data,
        meta: {
          page: page ?? 1,
          limit: take,
          total: total,
          totalPages: Math.ceil(total / take) || 1,
        },
      };
    }

    // Mode lama (backward-compatible): array full

    return this.prismaService.bookmark.findMany({
      where: where,
      select: this.bookmarkSelect,
      orderBy: orderBy,
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
    const { tags, ...bookmarkData } = createBookmarkDto;

    return this.prismaService.bookmark.create({
      data: {
        ...bookmarkData,
        userId: userId,
        tags: tags?.length
          ? {
              create: tags.map((tagName) => ({
                tag: {
                  connectOrCreate: {
                    where: {
                      name: tagName,
                    },
                    create: {
                      name: tagName,
                    },
                  },
                },
              })),
            }
          : undefined,
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

    const { tags, ...bookmarkData } = updateBookmarkDto;

    return this.prismaService.bookmark.update({
      where: {
        id: id,
      },
      data: {
        ...bookmarkData,
        ...(tags?.length
          ? {
              tags: {
                deleteMany: {},
                create: tags.map((tagName) => ({
                  tag: {
                    connectOrCreate: {
                      where: { name: tagName },
                      create: { name: tagName },
                    },
                  },
                })),
              },
            }
          : {}),
      },
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

  async toggleFavorite(id: string, userId: string) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: id,
      },
      select: {
        userId: true,
        isFavorite: true,
      },
    });

    if (!bookmark) throw new NotFoundException('Bookmark not found');
    if (bookmark.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this bookmark',
      );
    }

    return this.prismaService.bookmark.update({
      where: {
        id: id,
      },
      data: {
        isFavorite: !bookmark.isFavorite,
      },
      select: this.bookmarkSelect,
    });
  }
}
