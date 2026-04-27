import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum SellerStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  BLOCKED = 'blocked',
}

@Schema({ timestamps: true })
export class SellerProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  shopName: string;

  @Prop()
  description: string;

  @Prop()
  logo: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: String, enum: SellerStatus, default: SellerStatus.PENDING })
  status: SellerStatus;

  @Prop({ default: 0 })
  balance: number;
}

export const SellerProfileSchema = SchemaFactory.createForClass(SellerProfile);
