import { IsNotEmpty, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
