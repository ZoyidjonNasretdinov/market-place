import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.SELLER, Role.ADMIN)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary: 'Yangi mahsulot qo’shish',
    description:
      "Sotuvchi yoki ADMIN sifatida yangi mahsulot yaratish. Mahsulot yaratilgach, u 'active' holatda bo'ladi.",
  })
  @ApiResponse({
    status: 201,
    description: "Mahsulot muvaffaqiyatli qo'shildi.",
  })
  @ApiResponse({
    status: 403,
    description: "Ruxsat etilmagan (Sizda SELLER yoki ADMIN roli yo'q).",
  })
  create(@Request() req, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(req.user.userId, createProductDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Barcha faol mahsulotlarni olish',
    description:
      'Marketpleysdagi hamma faol mahsulotlarni qidirish va qulay filterlar yordamida saralash.',
  })
  @ApiResponse({ status: 200, description: "Mahsulotlar ro'yxati." })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Kategoriya ID-si bilan qidirish',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: "Nomi bo'yicha matnli qidiruv",
  })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimal narx' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maksimal narx' })
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @Get('seller/my-products')
  @ApiOperation({
    summary: 'Seller o’zining mahsulotlarini ko’rishi',
    description:
      "Sotuvchi o'zi qo'shgan barcha (faol va nofaol) mahsulotlarini ko'ra oladi.",
  })
  @ApiResponse({ status: 200, description: 'Sizning mahsulotlaringiz.' })
  findMyProducts(@Request() req) {
    return this.productsService.findBySeller(req.user.userId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Mahsulotni ID bo’yicha olish',
    description:
      "Bitta aniq mahsulot haqida to'liq texnik ma'lumotlar va narxi.",
  })
  @ApiResponse({ status: 200, description: 'Mahsulot topildi.' })
  @ApiResponse({
    status: 404,
    description: 'Bunday mahsulot bazada mavjud emas.',
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Roles(Role.SELLER, Role.ADMIN)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({
    summary: 'Mahsulotni yangilash',
    description:
      "Mahsulot ma'lumotlarini (narx, rasm, stock) tahrirlash. Faqat mahsulot egasi yoki ADMIN qilishi mumkin.",
  })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli yangilandi.' })
  @ApiResponse({
    status: 403,
    description: "Sizda boshqalarning mahsulotini tahrirlash huquqi yo'q.",
  })
  update(@Param('id') id: string, @Request() req, @Body() updateDto: any) {
    const isAdmin = req.user.role === Role.ADMIN;
    return this.productsService.update(id, req.user.userId, updateDto, isAdmin);
  }

  @Roles(Role.SELLER, Role.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({
    summary: 'Mahsulotni o’chirish',
    description:
      "Mahsulotni bazadan butunlay o'chirish. Faqat mahsulot egasi yoki ADMIN qila oladi.",
  })
  @ApiResponse({ status: 200, description: "Muvaffaqiyatli o'chirildi." })
  @ApiResponse({
    status: 403,
    description: "Boshqalarning mahsulotini o'chira olmaysiz.",
  })
  remove(@Param('id') id: string, @Request() req) {
    const isAdmin = req.user.role === Role.ADMIN;
    return this.productsService.remove(id, req.user.userId, isAdmin);
  }
}
