import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  discountPrice: number;

  @Prop([String])
  images: string[];

  @Prop({ default: 0 })
  stock: number;

  @Prop({ unique: true })
  sku: string;

  @Prop({ type: String, enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  soldCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
