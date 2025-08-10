import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMqModule } from 'src/rabbitmq/rabbitmq.module';
import { Payment } from './entities/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), RabbitMqModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
