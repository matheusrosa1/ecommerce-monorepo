import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Payment } from './payment/entities/payment.entity';
import { PaymentModule } from './payment/payment.module';
import { RabbitMqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Payment], // Carrega a entidade Payment
      synchronize: true, // Apenas para desenvolvimento
    }),
    PaymentModule,
    RabbitMqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
