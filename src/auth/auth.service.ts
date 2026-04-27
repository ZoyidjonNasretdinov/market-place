import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, phone, password, fullName, role } = registerDto;

    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      throw new ConflictException(
        'Email yoki telefon raqami allaqachon mavjud',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });

    await newUser.save();

    return {
      message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
      user: { id: newUser._id, fullName, email, role: newUser.role },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri");
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      message: 'Xush kelibsiz!',
      accessToken: this.jwtService.sign(payload),
      user: { id: user._id, fullName: user.fullName, role: user.role },
    };
  }
}
