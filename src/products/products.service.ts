import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(sellerId: string, createProductDto: CreateProductDto) {
    const product = new this.productModel({
      ...createProductDto,
      sellerId: new Types.ObjectId(sellerId),
    });
    return product.save();
  }

  async findAll(query: any) {
    const { categoryId, search, minPrice, maxPrice } = query;
    const filter: any = { status: 'active' };

    if (categoryId) filter.categoryId = categoryId;
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    return this.productModel.find(filter).populate('categoryId').exec();
  }

  async findBySeller(sellerId: string) {
    return this.productModel
      .find({ sellerId: new Types.ObjectId(sellerId) })
      .exec();
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('categoryId')
      .exec();
    if (!product) throw new NotFoundException('Mahsulot topilmadi');
    return product;
  }

  async update(
    id: string,
    sellerId: string | null,
    updateDto: any,
    isAdmin: boolean = false,
  ) {
    const product = await this.findOne(id);
    if (!isAdmin && (!sellerId || product.sellerId.toString() !== sellerId)) {
      throw new ForbiddenException(
        'Siz faqat o’zingizning mahsulotingizni tahrirlay olasiz',
      );
    }
    return this.productModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async remove(id: string, sellerId: string, isAdmin: boolean = false) {
    const product = await this.findOne(id);
    if (!isAdmin && product.sellerId.toString() !== sellerId) {
      throw new ForbiddenException(
        'Siz faqat o’zingizning mahsulotingizni o’chira olasiz',
      );
    }
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateStock(id: string, quantity: number) {
    const product = await this.findOne(id);
    if (product.stock < quantity) throw new Error('Stock yetarli emas');
    product.stock -= quantity;
    product.soldCount += quantity;
    return product.save();
  }
}
