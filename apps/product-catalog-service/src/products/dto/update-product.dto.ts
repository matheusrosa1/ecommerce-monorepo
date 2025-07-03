import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
