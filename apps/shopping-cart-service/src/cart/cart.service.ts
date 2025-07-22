import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  // ERRO 1: AQUI ESTAVA 'product' (singular), O CORRETO É 'products' (plural)
  private readonly catalogServiceBaseUrl =
    'http://product-catalog-service:3000/products';

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
    private readonly httpService: HttpService,
  ) {}

  // ... getCartKey e enrichCart (estão corretos) ...
  private getCartKey(sessionId: string): string {
    return `cart:${sessionId}`;
  }

  private async enrichCart(cart: Cart): Promise<Cart> {
    if (!cart || cart.items.length === 0) {
      return { items: [], total: 0 };
    }

    const productIds = cart.items.map((item) => item.productId).join(',');
    console.log(`[CartService] Buscando produtos com IDs: ${productIds}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get<Product[]>(
          `${this.catalogServiceUrl}?ids=${productIds}`,
        ),
      );
      const products = response.data;
      console.log('[CartService] Produtos recebidos do catálogo:', products);

      let total = 0;
      const enrichedItems = cart.items.map((item) => {
        console.log(
          `[CartService] Procurando pelo productId: ${item.productId}`,
        );
        const productDetail = products.find((p) => p.id === item.productId);

        if (productDetail) {
          console.log(`[CartService] Produto encontrado:`, productDetail);

          const priceAsNumber = parseFloat(productDetail.price as any);
          total += priceAsNumber * item.quantity;

          return { ...item, name: productDetail.name, price: priceAsNumber };
        }

        console.log(
          `[CartService] ATENÇÃO: Produto com ID ${item.productId} não encontrado na resposta.`,
        );
        return item;
      });

      return { items: enrichedItems, total: parseFloat(total.toFixed(2)) };
    } catch (error) {
      console.error('Erro ao buscar detalhes dos produtos:', error.message);
      return cart;
    }
  }

  async addItem(sessionId: string, addItemDto: AddItemDto): Promise<Cart> {
    const { productId, quantity } = addItemDto;

    try {
      // ERRO 2: AQUI ESTAVA USANDO 'catalogServiceUrl' em vez de 'catalogServiceBaseUrl'
      await firstValueFrom(
        this.httpService.get(`${this.catalogServiceBaseUrl}/${productId}`),
      );
    } catch (error) {
      console.error(`Tentativa de adicionar produto inexistente: ${productId}`);
      throw new NotFoundException(
        `Produto com ID "${productId}" não encontrado no catálogo.`,
      );
    }

    const cartKey = this.getCartKey(sessionId);
    const currentCart = await this.redisClient.get(cartKey);
    const cart: Cart = currentCart
      ? (JSON.parse(currentCart) as Cart)
      : { items: [] };

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await this.redisClient.set(cartKey, JSON.stringify(cart), 'EX', 86400);

    return this.enrichCart(cart);
  }

  // ... getCart e clearCart (estão corretos) ...
  async getCart(sessionId: string): Promise<Cart | null> {
    const cartKey = this.getCartKey(sessionId);
    const cartData = await this.redisClient.get(cartKey);

    if (!cartData) {
      return null;
    }
    const cart = JSON.parse(cartData) as Cart;
    return this.enrichCart(cart);
  }

  async clearCart(sessionId: string): Promise<void> {
    const cartKey = this.getCartKey(sessionId);
    await this.redisClient.del(cartKey);
  }
}
