import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { FileStorageService } from 'src/storage/file-storage-service';
import { In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
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

    const category = await this.categoriesService.findOne(categoryId);

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

  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.find({
      relations: ['category'],
    });

    if (products.length === 0) {
      throw new NotFoundException('Nenhum produto encontrado!');
    }

    return products;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado!`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    imageFile?: Express.Multer.File,
  ): Promise<Product> {
    const { categoryId, ...productData } = updateProductDto;
    const product = await this.findOne(id);

    let newImageUrl = product.imageUrl;

    if (imageFile) {
      if (product.imageUrl) {
        await this.fileStorageService.delete(product.imageUrl);
      }
      newImageUrl = await this.fileStorageService.save(imageFile);
    }

    // Atualiza as propriedades do produto com noovos dados
    Object.assign(product, productData);
    product.imageUrl = newImageUrl;

    if (categoryId) {
      const category = await this.categoriesService.findOne(categoryId);
      if (!category) {
        throw new NotFoundException(
          `Categoria com ID ${categoryId} não encontrada!`,
        );
      }
      product.category.id = category.id;
    }
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<string> {
    const product = await this.findOne(id);

    if (product.imageUrl) {
      await this.fileStorageService.delete(product.imageUrl);
    }

    await this.productRepository.delete(id);

    return `Produto com ID ${id} foi removido com sucesso!`;
  }

  findManyByIds(ids: string[]): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        id: In(ids), // O operador 'In' busca todos os registros cujos IDs estão no array
      },
      relations: ['category'],
    });
  }
}
