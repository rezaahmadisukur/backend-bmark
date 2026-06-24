import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.tag.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.tag.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(createTagDto: CreateTagDto) {
    return this.prismaService.tag.create({
      data: createTagDto,
    });
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    return this.prismaService.tag.update({
      where: {
        id: id,
      },
      data: updateTagDto,
    });
  }

  async delete(id: string) {
    return this.prismaService.tag.delete({
      where: {
        id: id,
      },
    });
  }
}
