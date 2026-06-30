import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly collectionSelect = {
    id: true,
    name: true,
    description: true,
    color: true,
    parentId: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
  } as const;

  async findAll(userId: string) {
    return this.prismaService.collection.findMany({
      where: {
        userId: userId,
      },
      select: this.collectionSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const collection = await this.prismaService.collection.findUnique({
      where: {
        id: id,
      },
      select: this.collectionSelect,
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('You do not have access to this collection');
    }

    return collection;
  }

  async create(createCollectionDto: CreateCollectionDto, userId: string) {
    return this.prismaService.collection.create({
      data: {
        ...createCollectionDto,
        userId: userId,
      },
      select: this.collectionSelect,
    });
  }

  async update(
    id: string,
    updateCollectionDto: UpdateCollectionDto,
    userId: string,
  ) {
    const collection = await this.prismaService.collection.findUnique({
      where: {
        id: id,
      },
      select: {
        userId: true,
      },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this collection',
      );
    }

    return this.prismaService.collection.update({
      where: {
        id: id,
      },
      data: updateCollectionDto,
      select: this.collectionSelect,
    });
  }

  async delete(id: string, userId: string) {
    const collection = await this.prismaService.collection.findUnique({
      where: {
        id: id,
      },
      select: {
        userId: true,
      },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this collection',
      );
    }

    return this.prismaService.collection.delete({
      where: {
        id: id,
      },
      select: this.collectionSelect,
    });
  }
}
