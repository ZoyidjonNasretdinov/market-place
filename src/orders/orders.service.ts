import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { SellersService } from '../sellers/sellers.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private productsService: ProductsService,
    private sellersService: SellersService,
  ) {}

  async create(buyerId: string, createOrderDto: CreateOrderDto) {
    let totalPrice = 0;
    const orderItems: any[] = [];
    let sellerId: Types.ObjectId = undefined as any;

    for (const item of createOrderDto.items) {
      const product = await this.productsService.findOne(item.productId);
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Mahsulot ${product.title} bazada yetarli emas`,
        );
      }

      await this.productsService.updateStock(item.productId, item.quantity);

      const price =
        product.discountPrice > 0 ? product.discountPrice : product.price;
      totalPrice += price * item.quantity;

      orderItems.push({
        productId: product._id,
        title: product.title,
        quantity: item.quantity,
        price: price,
      });

      sellerId = product.sellerId; // Faraz qilamiz: bir order bitta sellerdan
    }

    const commission = totalPrice * 0.1; // 10% Platforma komissiyasi
    const sellerIncome = totalPrice - commission;

    const order = new this.orderModel({
      buyerId: new Types.ObjectId(buyerId),
      sellerId: sellerId,
      items: orderItems,
      totalPrice,
      commission,
      sellerIncome,
      deliveryAddress: createOrderDto.deliveryAddress,
    });

    return order.save();
  }

  async findByBuyer(buyerId: string) {
    return this.orderModel
      .find({ buyerId: new Types.ObjectId(buyerId) })
      .exec();
  }

  async findBySeller(sellerId: string) {
    return this.orderModel
      .find({ sellerId: new Types.ObjectId(sellerId) })
      .exec();
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException('Order topilmadi');
    return order;
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    userId: string,
    isAdmin: boolean,
  ) {
    const order = await this.findOne(id);

    // Xavfsizlik: Seller faqat o’z orderini statusini o’zgartira oladi
    if (!isAdmin && order.sellerId.toString() !== userId) {
      throw new BadRequestException('Sizga ruxsat yo’q');
    }

    order.orderStatus = status;

    // Agar delivered bo’lsa, seller balansiga pul tushadi
    if (status === OrderStatus.DELIVERED && order.paymentStatus === 'paid') {
      await this.sellersService.increaseBalance(
        order.sellerId.toString(),
        order.sellerIncome,
      );
    }

    return order.save();
  }
}
