import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@ApiBearerAuth('access-token')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
// BR-02: chỉ Admin được quản lý sản phẩm.
@Roles(Role.ADMIN)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Lấy danh sách danh mục sản phẩm' })
  findCategories() {
    return this.productsService.findCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết sản phẩm' })
  findOne(@Param('id', ParseIntPipe) productId: number) {
    return this.productsService.findOne(productId);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm sản phẩm' })
  create(@Body() dto: CreateProductDto, @Req() request: AuthenticatedRequest) {
    return this.productsService.create(dto, request.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  update(
    @Param('id', ParseIntPipe)
    productId: number,
    @Body() dto: UpdateProductDto,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.productsService.update(productId, dto, request.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa hoặc ngừng hoạt động sản phẩm' })
  remove(
    @Param('id', ParseIntPipe)
    productId: number,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.productsService.remove(productId, request.user);
  }
}
