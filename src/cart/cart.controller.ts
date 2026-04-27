import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(Role.BUYER)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: 'Savatchani ko’rish',
    description:
      "Xaridor o'z savatchasidagi barcha mahsulotlarni, ularning soni va narxini ko'rishi mumkin.",
  })
  @ApiResponse({
    status: 200,
    description: "Savatcha ma'lumotlari muvaffaqiyatli qaytarildi.",
  })
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Roles(Role.BUYER)
  @ApiBearerAuth()
  @Post('add')
  @ApiOperation({
    summary: 'Savatchaga mahsulot qo’shish',
    description:
      "Mahsulotni savatchaga qo'shish. Agar u allaqachon mavjud bo'lsa, miqdori (quantity) oshadi.",
  })
  @ApiResponse({
    status: 201,
    description: "Mahsulot muvaffaqiyatli qo'shildi.",
  })
  @ApiResponse({
    status: 404,
    description: 'Bunday ID-ga ega mahsulot topilmadi.',
  })
  addToCart(
    @Request() req,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.addToCart(
      req.user.userId,
      productId,
      quantity || 1,
    );
  }

  @Roles(Role.BUYER)
  @ApiBearerAuth()
  @Patch('item/:productId')
  @ApiOperation({
    summary: 'Mahsulot miqdorini o’zgartirish',
    description:
      "Savatchadagi mahsulot sonini kamaytirish yoki oshirish. Miqdor 0 kiritilsa, mahsulot savatdan o'chiriladi.",
  })
  @ApiResponse({ status: 200, description: 'Miqdor yangilandi.' })
  @ApiResponse({ status: 404, description: 'Mahsulot savatda topilmadi.' })
  updateQuantity(
    @Request() req,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateQuantity(
      req.user.userId,
      productId,
      quantity,
    );
  }

  @Roles(Role.BUYER)
  @ApiBearerAuth()
  @Delete('item/:productId')
  @ApiOperation({
    summary: 'Mahsulotni savatdan o’chirish',
    description: 'Savatchadagi bitta mahsulotni butunlay olib tashlash.',
  })
  @ApiResponse({ status: 200, description: "Mahsulot savatdan o'chirildi." })
  removeItem(@Request() req, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.user.userId, productId);
  }

  @Roles(Role.BUYER)
  @ApiBearerAuth()
  @Delete('clear')
  @ApiOperation({
    summary: 'Savatchani tozalash',
    description: "Savatchadagi barcha mahsulotlarni o'chirib yuborish (Clear).",
  })
  @ApiResponse({ status: 200, description: 'Savatcha butunlay tozalandi.' })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}
