import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'aziz@example.com',
    description: 'Tizimga kirish uchun elektron pochta manzili',
  })
  @IsEmail({}, { message: "Noto'g'ri elektron pochta manzili kiritildi" })
  email: string;

  @ApiProperty({
    example: 'maxfiy_parol123',
    description: 'Tizimga kirish uchun parol',
  })
  @IsNotEmpty({ message: "Parol bo'sh bo'lmasligi kerak" })
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
  password: string;
}
