import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [RedisModule, HttpModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
