import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary: 'Yangi kategoriya yaratish',
    description:
      "Faqat ADMINlar yangi kategoriyalar qo'shishi mumkin. 'parentCategoryId' orqali ierarxiya yaratish mumkin.",
  })
  @ApiResponse({
    status: 201,
    description: 'Kategoriya muvaffaqiyatli yaratildi.',
  })
  @ApiResponse({ status: 403, description: "Sizda ADMIN roli yo'q." })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Barcha kategoriyalarni olish',
    description:
      "Tizimdagi barcha kategoriyalar ro'yxati, parent ma'lumotlari bilan.",
  })
  @ApiResponse({ status: 200, description: "Ro'yxat muvaffaqiyatli olindi." })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Kategoriyani ID bo’yicha olish',
    description: "Bitta aniq kategoriya ma'lumotlarini ID orqali ko'rish.",
  })
  @ApiResponse({ status: 200, description: "Ma'lumot topildi." })
  @ApiResponse({
    status: 404,
    description: 'Bunday ID-ga ega kategoriya topilmadi.',
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({
    summary: 'Kategoriyani yangilash',
    description:
      "Kategoriya nomi, rasm yoki parent-ini o'zgartirish. Faqat ADMIN uchun.",
  })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli yangilandi.' })
  update(@Param('id') id: string, @Body() updateCategoryDto: any) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({
    summary: 'Kategoriyani o’chirish',
    description: "Kategoriyani butunlay o'chirib tashlash. Faqat ADMIN uchun.",
  })
  @ApiResponse({ status: 200, description: "Muvaffaqiyatli o'chirildi." })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
