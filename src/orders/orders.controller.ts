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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { OrderStatus } from './schemas/order.schema';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(Role.BUYER)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary: 'Yangi buyurtma yaratish',
    description:
      'Savatdagi mahsulotlarni sotib olish uchun buyurtma berish. Bunda stock kamayadi va platforma komissiyasi hisoblanadi.',
  })
  @ApiResponse({ status: 201, description: 'Buyurtma yaratildi.' })
  @ApiResponse({
    status: 400,
    description: "Stock yetarli emas yoki ma'lumotlar xato.",
  })
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, createOrderDto);
  }

  @Roles(Role.BUYER)
  @ApiBearerAuth()
  @Get('my')
  @ApiOperation({
    summary: 'Buyer o’z buyurtmalarini ko’rishi',
    description:
      "Xaridor o'zi bergan barcha buyurtmalar ro'yxatini va ularning statusini ko'ra oladi.",
  })
  @ApiResponse({ status: 200, description: "Buyurtmalaringiz ro'yxati." })
  findMyOrders(@Request() req) {
    return this.ordersService.findByBuyer(req.user.userId);
  }

  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @Get('seller')
  @ApiOperation({
    summary: 'Seller o’ziga kelgan buyurtmalarni ko’rishi',
    description:
      "Sotuvchi o'z mahsulotlariga tushgan barcha buyurtmalarni ko'radi va ularni jo'natishga tayyorlaydi.",
  })
  @ApiResponse({ status: 200, description: 'Sizga kelgan buyurtmalar.' })
  findSellerOrders(@Request() req) {
    return this.ordersService.findBySeller(req.user.userId);
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({
    summary: 'Buyurtmani ID bo’yicha ko’rish',
    description:
      'Buyurtma tafsilotlari: mahsulotlar, narx, komissiya va yetkazib berish manzili.',
  })
  @ApiResponse({ status: 200, description: 'Buyurtma topildi.' })
  @ApiResponse({ status: 404, description: 'Bunday buyurtma mavjud emas.' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Roles(Role.SELLER, Role.ADMIN)
  @ApiBearerAuth()
  @Patch(':id/status')
  @ApiOperation({
    summary: 'Buyurtma statusini yangilash',
    description:
      "Buyurtmani qabul qilish, jo'natish yoki yetkazilgan deb belgilash. Yetkazilgach, sotuvchi balansiga pul tushadi.",
  })
  @ApiResponse({ status: 200, description: "Status o'zgartirildi." })
  @ApiResponse({
    status: 403,
    description: "Faqat tegishli sotuvchi yoki ADMIN o'zgartira oladi.",
  })
  updateStatus(
    @Param('id') id: string,
    @Request() req,
    @Body('status') status: OrderStatus,
  ) {
    const isAdmin = req.user.role === Role.ADMIN;
    return this.ordersService.updateStatus(
      id,
      status,
      req.user.userId,
      isAdmin,
    );
  }
}
