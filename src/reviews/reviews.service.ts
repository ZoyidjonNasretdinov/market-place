import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from './schemas/review.schema';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private ordersService: OrdersService,
    private productsService: ProductsService,
  ) {}

  async create(
    buyerId: string,
    productId: string,
    rating: number,
    comment: string,
  ) {
    // 1. Tekshirish: Buyer bu mahsulotni sotib olganmi?
    const buyerOrders = await this.ordersService.findByBuyer(buyerId);
    const hasBought = buyerOrders.some(
      (order) =>
        order.orderStatus === 'delivered' &&
        order.items.some((item) => item.productId.toString() === productId),
    );

    if (!hasBought) {
      throw new ForbiddenException(
        'Sharh qoldirish uchun mahsulotni sotib olgan bo’lishingiz kerak',
      );
    }

    // 2. Sharh yaratish
    const review = new this.reviewModel({
      buyerId: new Types.ObjectId(buyerId),
      productId: new Types.ObjectId(productId),
      rating,
      comment,
    });
    await review.save();

    // 3. Mahsulot reytingini yangilash
    await this.updateProductRating(productId);

    return review;
  }

  async findByProduct(productId: string) {
    return this.reviewModel
      .find({ productId: new Types.ObjectId(productId) })
      .populate('buyerId', 'fullName')
      .exec();
  }

  private async updateProductRating(productId: string) {
    const reviews = await this.reviewModel
      .find({ productId: new Types.ObjectId(productId) })
      .exec();
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
        : 0;

    await this.productsService.update(
      productId,
      null,
      { rating: averageRating },
      true,
    );
  }

  async remove(id: string, userId: string, isAdmin: boolean) {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) throw new NotFoundException('Sharh topilmadi');

    if (!isAdmin && review.buyerId.toString() !== userId) {
      throw new ForbiddenException('Ruxsat yo’q');
    }
    await this.reviewModel.findByIdAndDelete(id).exec();
    await this.updateProductRating(review.productId.toString());
  }
}
