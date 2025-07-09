import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { Category } from 'src/categories/entities/category.entity';
import { FileStorageService } from 'src/storage/file-storage-service';
import { LocalFileStorageService } from 'src/storage/local-file-storage-service';
import { randomNameFile } from 'src/utils/random-name-file';
import { CategoriesModule } from '../categories/categories.module';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: randomNameFile,
      }),
    }),
    CategoriesModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: FileStorageService,
      useClass: LocalFileStorageService,
    },
  ],
})
export class ProductsModule {}
