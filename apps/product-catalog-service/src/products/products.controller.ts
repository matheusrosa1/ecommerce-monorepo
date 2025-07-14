import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileCleanupInterceptor } from '../common/interceptors/file-cleanup.interceptor';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imageFile'), FileCleanupInterceptor)
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, imageFile);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageFile'), FileCleanupInterceptor)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    return this.productsService.update(id, updateProductDto, imageFile);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Get('batch')
  findManyByIds(@Query('ids') ids: string) {
    // Os IDs virão como uma string separada por vírgula, então nós a dividimos em um array
    const idsArray = ids.split(',');
    return this.productsService.findManyByIds(idsArray);
  }
}
