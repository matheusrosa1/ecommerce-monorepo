import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { firstValueFrom } from 'rxjs';
import { Product } from 'src/interfaces/Product';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { Cart } from '../interfaces/Cart';
import { AddItemDto } from './dto/add-item.dto';

@Injectable()
export class CartService {
  private readonly catalogServiceUrl =
    'http://product-catalog-service:3000/products/batch';
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
    private readonly httpService: HttpService,
  ) {}

  // Chave para armazenar o carrinho no Redis. Ex: "cart:user123"
  private getCartKey(sessionId: string): string {
    return `cart:${sessionId}`;
  }

  private async enrichCart(cart: Cart): Promise<Cart> {
    if (!cart || cart.items.length === 0) {
      return { items: [], total: 0 };
    }

    const productId = cart.items.map((item) => item.productId).join(',');

    try {
      const response = await firstValueFrom(
        this.httpService.get<Product[]>(
          `${this.catalogServiceUrl}?ids=${productId}`,
        ),
      );

      const products = response.data;

      let total = 0;

      const enrichedItems = cart.items.map((item) => {
        const productDetail = products.find((p) => p.id === item.productId);
        if (productDetail) {
          total += productDetail.price * item.quantity;
          return {
            ...item,
            name: productDetail.name,
            price: productDetail.price,
          };
        }
        return item;
      });
      return { items: enrichedItems, total: parseFloat(total.toFixed(2)) };
    } catch (error) {
      console.error('Erro ao buscar detalhes dos produtos: ', error);
      return cart;
    }
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
    return this.enrichCart(cart);
  }

  async getCart(sessionId: string): Promise<Cart | null> {
    const cartKey = this.getCartKey(sessionId);
    const cartData = await this.redisClient.get(cartKey);

    if (!cartData) {
      return null; // Retorna null se o carrinho não existir
    }
    const cart = JSON.parse(cartData) as Cart;
    return this.enrichCart(cart);
  }

  async clearCart(sessionId: string): Promise<void> {
    const cartKey = this.getCartKey(sessionId);
    await this.redisClient.del(cartKey); // Deleta o carrinho do Redis
  }
}
