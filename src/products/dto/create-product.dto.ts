import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsMongoId,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: '60d5ecb5b48777001f97c234',
    description: 'Kategoriya ID',
  })
  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;

  @ApiProperty({ example: 'iPhone 15 Pro' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Apple smartfoni' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 1200 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 1100, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @ApiProperty({ example: ['img1.png', 'img2.png'], type: [String] })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'IP15PRO-BLUE' })
  @IsNotEmpty()
  @IsString()
  sku: string;
}
