import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBookmarkDto {
  @IsString()
  @IsUrl()
  url!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  favicon?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
