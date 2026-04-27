import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parentCategoryId: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
