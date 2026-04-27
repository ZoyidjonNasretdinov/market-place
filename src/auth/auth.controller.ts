import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: "Ro'yxatdan o'tish (Register)",
    description:
      "Yangi foydalanuvchini tizimga qo'shish. BUYER, SELLER yoki ADMIN rollaridan birini tanlash mumkin.",
  })
  @ApiResponse({
    status: 201,
    description: 'Foydalanuvchi muvaffaqiyatli yaratildi.',
  })
  @ApiResponse({
    status: 400,
    description: "Kiritilgan ma'lumotlarda xatolik bor (Validatsiya xatosi).",
  })
  @ApiResponse({
    status: 409,
    description: 'Bunday email yoki telefon raqami allaqachon mavjud.',
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Tizimga kirish (Login)',
    description:
      "Email va parol orqali JWT token olish. Ushbu tokenni keyingi barcha so'rovlarda 'Authorization: Bearer <token>' ko'rinishida yuborish kerak.",
  })
  @ApiResponse({
    status: 200,
    description: 'Login muvaffaqiyatli. AccessToken qaytariladi.',
  })
  @ApiResponse({ status: 401, description: "Email yoki parol noto'g'ri." })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({
    summary: "Joriy foydalanuvchi ma'lumotlari (Me)",
    description:
      "Yuborilgan JWT token asosida joriy tizimdan foydalanayotgan odamning ma'lumotlarini qaytaradi.",
  })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchi ma'lumotlari muvaffaqiyatli olindi.",
  })
  @ApiResponse({
    status: 401,
    description: "Avtorizatsiya xatosi (Token yo'q yoki noto'g'ri).",
  })
  getProfile(@Request() req) {
    return req.user;
  }
}
