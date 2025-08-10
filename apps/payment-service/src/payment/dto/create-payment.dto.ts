import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  total: number;

  @IsArray()
  @IsNotEmpty()
  items: any[]; // Para simplificar, aceitaremos um array de qualquer tipo.
}
