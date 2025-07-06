import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { FileStorageService } from 'src/storage/file-storage-service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(FileStorageService)
    private readonly fileStorageService: FileStorageService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    imageFile: Express.Multer.File,
  ): Promise<Product> {
    if (!imageFile) {
      throw new BadRequestException(
        'O arquivo de imagem do produto é obrigatório',
      );
    }
    const imageUrl = await this.fileStorageService.save(imageFile);

    const { categoryId, ...productData } = createProductDto;

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) {
      throw new NotFoundException(
        `Categoria com ID ${categoryId} não encontrada!`,
      );
    }

    const product = this.productRepository.create({
      ...productData,
      imageUrl,
      category,
    });

    return this.productRepository.save(product);
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
