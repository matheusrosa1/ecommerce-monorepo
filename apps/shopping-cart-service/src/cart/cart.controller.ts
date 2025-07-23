import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { Cart } from 'src/interfaces/Cart';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':sessionId/items')
  async addItem(
    @Param('sessionId') sessionId: string,
    @Body(new ValidationPipe({ transform: true })) addItemDto: AddItemDto,
  ): Promise<Cart> {
    return this.cartService.addItem(sessionId, addItemDto);
  }

  @Get(':sessionId')
  async getCart(@Param('sessionId') sessionId: string): Promise<Cart | null> {
    return this.cartService.getCart(sessionId);
  }

  @Delete(':sessionId')
  async clearCart(@Param('sessionId') sessionId: string): Promise<void> {
    return this.cartService.clearCart(sessionId);
  }
}
