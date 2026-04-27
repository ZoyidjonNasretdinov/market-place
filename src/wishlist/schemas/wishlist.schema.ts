import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Wishlist extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Product' }])
  products: Types.ObjectId[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
