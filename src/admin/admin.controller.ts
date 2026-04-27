import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { SellersService } from '../sellers/sellers.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@ApiTags('Admin')
@Controller('admin')
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
    private readonly sellersService: SellersService,
  ) {}

  @Get('statistics')
  @ApiOperation({
    summary: 'Tizim statistikalarini olish',
    description:
      "Platformadagi jami foydalanuvchilar, sotuvchilar va ularning rollari bo'yicha hisobot.",
  })
  @ApiResponse({
    status: 200,
    description: 'Statistikalar muvaffaqiyatli olindi.',
  })
  @ApiResponse({ status: 403, description: "Sizda ADMIN roli yo'q." })
  getStats() {
    return this.adminService.getStatistics();
  }

  @Get('users')
  @ApiOperation({
    summary: 'Barcha foydalanuvchilar ro’yxati',
    description:
      "Tizimdagi barcha ro'yxatdan o'tgan foydalanuvchilar ma'lumotlarini ko'rish.",
  })
  @ApiResponse({ status: 200, description: "Foydalanuvchilar ro'yxati." })
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('sellers')
  @ApiOperation({
    summary: 'Barcha sellerlar ro’yxati',
    description: 'Tizimdagi barcha sotuvchi profillari va ularning holati.',
  })
  @ApiResponse({ status: 200, description: "Sellerlar ro'yxati." })
  getSellers() {
    return this.sellersService.findAll();
  }
}
