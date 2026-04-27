import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PREPARING = 'preparing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema()
class OrderItem {
  @Prop({ type: Types.ObjectId, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  buyerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId: Types.ObjectId;

  @Prop({ type: [SchemaFactory.createForClass(OrderItem)] })
  items: OrderItem[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: 0 })
  deliveryPrice: number;

  @Prop({ required: true })
  commission: number;

  @Prop({ required: true })
  sellerIncome: number;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus: PaymentStatus;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  orderStatus: OrderStatus;

  @Prop({ required: true })
  deliveryAddress: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
