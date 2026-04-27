import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SellersService } from './sellers.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { SellerStatus } from './schemas/seller-profile.schema';

@ApiTags('Sellers')
@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @Post('profile')
  @ApiOperation({
    summary: 'Seller profilini yaratish',
    description:
      "Sotuvchi sifatida o'z do'kon nomi va boshqa ma'lumotlarini kiritish. Faqat SELLER roli bo'lganlar ishlata oladi.",
  })
  @ApiResponse({
    status: 201,
    description: 'Profil yaratildi. Endi Admin tasdiqlashi shart.',
  })
  @ApiResponse({ status: 403, description: "Sizda SELLER roli yo'q." })
  createProfile(@Request() req, @Body() profileDto: any) {
    return this.sellersService.createProfile(req.user.userId, profileDto);
  }

  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @Get('my-profile')
  @ApiOperation({
    summary: 'Seller o’z profilini ko’rishi',
    description:
      "Sotuvchi o'zining do'koni holati va balansini tekshirishi mumkin.",
  })
  @ApiResponse({ status: 200, description: "Profil ma'lumotlari qaytarildi." })
  getMyProfile(@Request() req) {
    return this.sellersService.findByUserId(req.user.userId);
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Patch(':id/status')
  @ApiOperation({
    summary: 'Seller statusini o’zgartirish (Approve/Reject)',
    description:
      'Admin tomonidan sotuvchini tasdiqlash yoki rad etish. Faqat ADMIN roli uchun.',
  })
  @ApiResponse({ status: 200, description: 'Status yangilandi.' })
  @ApiResponse({ status: 403, description: "Sizda ADMIN roli yo'q." })
  updateStatus(@Param('id') id: string, @Body('status') status: SellerStatus) {
    return this.sellersService.updateStatus(id, status);
  }
}
