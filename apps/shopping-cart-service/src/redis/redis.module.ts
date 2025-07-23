import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';

// Criamos um token de injeção para o cliente Redis
export const REDIS_CLIENT = 'REDIS_CLIENT';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) {
          throw new Error('REDIS_URL is not defined in environment variables.');
        }
        // A URL vem da variável de ambiente que definimos no docker-compose.yml
        const client = new Redis(redisUrl);
        client.on('error', (err) => console.error('Redis Client Error', err));
        client.on('connect', () => console.log('Connected to Redis'));
        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT], // Exportamos o cliente para que outros módulos possam usá-lo
})
export class RedisModule {}
