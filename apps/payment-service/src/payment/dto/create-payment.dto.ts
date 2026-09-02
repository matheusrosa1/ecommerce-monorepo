import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { PaymentItemDto } from './PaymentItemDto';

export class CreatePaymentDto {
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  total!: number;

  @IsArray()
  @IsNotEmpty()
  items!: PaymentItemDto[]; // Para simplificar, aceitaremos um array de qualquer tipo.
}
