import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiProperty({ example: '60d5ecb5b48777001f97c234' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'Toshkent sh., Yunusobod tumani, 4-mavze' })
  @IsNotEmpty()
  @IsString()
  deliveryAddress: string;
}
