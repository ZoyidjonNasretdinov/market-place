import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Roles(Role.BUYER)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: 'Wishlistni ko’rish',
    description:
      "Xaridor o'zi yoqtirgan mahsulotlar ro'yxatini ko'rishi mumkin.",
  })
  @ApiResponse({ status: 200, description: "Saralangan mahsulotlar ro'yxati." })
  getWishlist(@Request() req) {
    return this.wishlistService.getWishlist(req.user.userId);
  }

  @Roles(Role.BUYER)
  @ApiBearerAuth()
  @Post('toggle')
  @ApiOperation({
    summary: 'Mahsulotni wishlistga qo’shish/o’chirish',
    description:
      "Agar mahsulot wishlistda bo'lsa o'chiriladi, bo'lmasa qo'shiladi (Toggle logic).",
  })
  @ApiResponse({
    status: 201,
    description: "Holat muvaffaqiyatli o'zgartirildi.",
  })
  toggle(@Request() req, @Body('productId') productId: string) {
    return this.wishlistService.toggleWishlist(req.user.userId, productId);
  }
}
