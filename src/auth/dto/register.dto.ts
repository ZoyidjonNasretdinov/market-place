import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role } from '../../users/enums/role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'Aziz Alimov', description: "To'liq ism" })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'aziz@example.com', description: 'Elektron pochta' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+998901234567', description: 'Telefon raqami' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'maxfiy123', description: 'Parol (min 6 belgi)' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: Role,
    default: Role.BUYER,
    description: 'Foydalanuvchi roli',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
