import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles(Role.BUYER)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary: 'Mahsulotga sharh qoldirish',
    description:
      "Faqat mahsulotni sotib olgan va 'delivered' holatiga kelgan xaridor sharh yozishi mumkin.",
  })
  @ApiResponse({
    status: 201,
    description:
      "Sharh muvaffaqiyatli qo'shildi. Mahsulot reytingi avtomatik yangilanadi.",
  })
  @ApiResponse({
    status: 403,
    description: "Buning uchun mahsulotni sotib olgan bo'lishingiz shart.",
  })
  create(
    @Request() req,
    @Body('productId') productId: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
  ) {
    return this.reviewsService.create(
      req.user.userId,
      productId,
      rating,
      comment,
    );
  }

  @Public()
  @Get('product/:productId')
  @ApiOperation({
    summary: 'Mahsulotning barcha sharhlarini olish',
    description:
      'Bitta mahsulotga xaridorlar tomonidan qoldirilgan barcha izohlar va baholar.',
  })
  @ApiResponse({ status: 200, description: "Sharhlar ro'yxati qaytarildi." })
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({
    summary: 'Sharhni o’chirish',
    description:
      "O'z sharhini o'chirish yoki ADMIN tomonidan keraksiz sharhlarni o'chirish.",
  })
  @ApiResponse({ status: 200, description: "Sharh muvaffaqiyatli o'chirildi." })
  @ApiResponse({
    status: 403,
    description: "Boshqalarning sharhini o'chirishga ruxsat yo'q.",
  })
  remove(@Param('id') id: string, @Request() req) {
    const isAdmin = req.user.role === Role.ADMIN;
    return this.reviewsService.remove(id, req.user.userId, isAdmin);
  }
}
