import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { Cart } from '../interfaces/Cart';
import { AddItemDto } from './dto/add-item.dto';

@Injectable()
export class CartService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) {}

  // Chave para armazenar o carrinho no Redis. Ex: "cart:user123"
  private getCartKey(sessionId: string): string {
    return `cart:${sessionId}`;
  }

  async addItem(sessionId: string, addItemDto: AddItemDto): Promise<Cart> {
    const { productId, quantity } = addItemDto;
    const cartKey = this.getCartKey(sessionId);

    // 1. Busca o carrinho atual no Redi
    const currentCart = await this.redisClient.get(cartKey);

    // 2. Verifica se o item já existe no carrinho
    let cart: Cart = { items: [] };

    if (currentCart) {
      try {
        cart = JSON.parse(currentCart) as Cart;
      } catch (error) {
        // Log do erro para monitoramento
        console.error(
          `Erro ao fazer parse do carrinho para sessão ${sessionId}:`,
          error,
        );
        // Inicializa carrinho vazio se JSON estiver corrompido
        cart = { items: [] };
      }
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (existingItemIndex > -1) {
      // Se existe, apenas atualiza a quantidade
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    // Salva o carrinho atualizado no Redis]
    // Usamos 'EX 86400' para expirar o carrinho em 24 horas
    await this.redisClient.set(cartKey, JSON.stringify(cart), 'EX', 86400); // Expira em 24 horas
    return cart;
  }

  async getCart(sessionId: string): Promise<Cart | null> {
    const cartKey = this.getCartKey(sessionId);
    const cartData = await this.redisClient.get(cartKey);

    if (!cartData) {
      return null; // Retorna null se o carrinho não existir
    }
    return JSON.parse(cartData) as Cart;
  }

  async clearCart(sessionId: string): Promise<void> {
    const cartKey = this.getCartKey(sessionId);
    await this.redisClient.del(cartKey); // Deleta o carrinho do Redis
  }
}
