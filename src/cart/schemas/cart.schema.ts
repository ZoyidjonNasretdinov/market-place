import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, default: 1 })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: [SchemaFactory.createForClass(CartItem)] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
