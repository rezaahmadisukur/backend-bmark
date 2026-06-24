import { Injectable } from '@nestjs/common';
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
  } as const;

  async findAll() {
    return this.prismaService.collection.findMany({
      select: this.collectionSelect,
    });
  }

  async findOne(id: string) {
    return this.prismaService.collection.findUnique({
      where: {
        id: id,
      },
      select: this.collectionSelect,
    });
  }

  async create(createCollectionDto: CreateCollectionDto) {
    return this.prismaService.collection.create({
      data: {
        name: createCollectionDto.name,
        description: createCollectionDto.description,
        color: createCollectionDto.color,
        parentId: createCollectionDto.parentId,
        userId: 'temp-user-id',
      },
      select: this.collectionSelect,
    });
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    return this.prismaService.collection.update({
      where: {
        id: id,
      },
      data: updateCollectionDto,
      select: this.collectionSelect,
    });
  }

  async delete(id: string) {
    return this.prismaService.collection.delete({
      where: {
        id: id,
      },
      select: this.collectionSelect,
    });
  }
}
