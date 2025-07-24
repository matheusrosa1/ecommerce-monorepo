import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  processPayment(
    @Body(new ValidationPipe()) createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.processPayment(createPaymentDto);
  }
}
