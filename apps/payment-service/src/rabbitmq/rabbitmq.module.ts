import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE', // Um nome/token para este cliente
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: 'payments_queue', // O nome da fila que ele usará
        },
      },
    ]),
  ],
  exports: [ClientsModule], // Exporta o ClientsModule para que outros módulos possam injetar o cliente
})
export class RabbitMqModule {}
