import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Elektronika' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'elektronika' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ example: 'https://image-url.com/cat.png', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: '60d5ecb5b48777001f97c234', required: false })
  @IsOptional()
  @IsMongoId()
  parentCategoryId?: string;
}
