import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [RedisModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
