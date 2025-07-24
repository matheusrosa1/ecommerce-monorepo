import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentStatus } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @Inject('PAYMENT_SERVICE')
    private readonly rabbitClient: ClientProxy,
  ) {}

  async processPayment(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      status: PaymentStatus.PENDING,
    });
    await this.paymentRepository.save(payment);

    setTimeout(() => {
      void (async () => {
        const isApproved = Math.random() > 0.3; // 70% de chance de ser aprovado
        payment.status = isApproved
          ? PaymentStatus.APPROVED
          : PaymentStatus.REJECTED;

        // 3. Atualiza o status final do pagamento no banco
        const updatedPayment = await this.paymentRepository.save(payment);

        // 4. Publica o evento no RabbitMQ
        this.rabbitClient.emit('pagamento_processado', {
          paymentId: updatedPayment.id,
          status: updatedPayment.status,
        });

        console.log(
          `[PaymentService] Pagamento ${updatedPayment.id} processado com status: ${updatedPayment.status}`,
        );
      })();
    }, 2000);

    return {
      paymentId: payment.id,
      status: payment.status,
      message: 'Pagamento em processamento',
    };
  }
}
