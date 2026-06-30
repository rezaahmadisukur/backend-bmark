import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly tagSelect = {
    id: true,
    name: true,
    color: true,
    createdAt: true,
  } as const;

  async findAll() {
    return this.prismaService.tag.findMany({
      select: this.tagSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prismaService.tag.findUnique({
      where: {
        id: id,
      },
      select: this.tagSelect,
    });
  }

  async create(createTagDto: CreateTagDto) {
    return this.prismaService.tag.create({
      data: createTagDto,
      select: this.tagSelect,
    });
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    return this.prismaService.tag.update({
      where: {
        id: id,
      },
      data: updateTagDto,
      select: this.tagSelect,
    });
  }

  async delete(id: string) {
    return this.prismaService.tag.delete({
      where: {
        id: id,
      },
      select: this.tagSelect,
    });
  }
}
