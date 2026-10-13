import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service.js';
import { QueryProductsDto } from './dto/query-products.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@ApiTags('Товары (Products)')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить список товаров с фильтрацией, сортировкой и пагинацией',
  })
  @ApiResponse({ status: 200, description: 'Список товаров успешно получен' })
  findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAll(query);
  }

  @Get('categories')
  @ApiOperation({
    summary: 'Получить список категорий с количеством товаров в каждой',
  })
  @ApiResponse({ status: 200, description: 'Список категорий с подсчетом товаров' })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get('featured')
  @ApiOperation({ summary: 'Получить избранные / рекомендуемые товары для главной страницы' })
  @ApiResponse({ status: 200, description: 'Список избранных товаров' })
  getFeatured() {
    return this.productsService.getFeatured();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить детальную информацию о товаре по его ID' })
  @ApiParam({ name: 'id', description: 'ID товара', type: Number })
  @ApiResponse({ status: 200, description: 'Товар найден' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'Получить похожие товары из той же категории' })
  @ApiParam({ name: 'id', description: 'ID товара', type: Number })
  @ApiResponse({ status: 200, description: 'Список похожих товаров' })
  getRelated(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getRelated(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый товар' })
  @ApiResponse({ status: 201, description: 'Товар успешно создан' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить существующий товар по ID' })
  @ApiParam({ name: 'id', description: 'ID товара', type: Number })
  @ApiResponse({ status: 200, description: 'Товар успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить товар по ID' })
  @ApiParam({ name: 'id', description: 'ID товара', type: Number })
  @ApiResponse({ status: 200, description: 'Товар успешно удален' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
