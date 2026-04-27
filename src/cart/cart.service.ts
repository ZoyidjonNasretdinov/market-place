import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private productsService: ProductsService,
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('items.productId')
      .exec();

    if (!cart) {
      cart = new this.cartModel({
        userId: new Types.ObjectId(userId),
        items: [],
      });
      await cart.save();
    }
    return cart;
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    const cart = await this.getCart(userId);
    const product = await this.productsService.findOne(productId);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId._id.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        quantity,
        price:
          product.discountPrice > 0 ? product.discountPrice : product.price,
      } as any);
    }

    return cart.save();
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const cart = await this.getCart(userId);
    const itemIndex = cart.items.findIndex(
      (item) => item.productId._id.toString() === productId,
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      return cart.save();
    }
    throw new NotFoundException('Mahsulot savatda topilmadi');
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId,
    ) as any;
    return cart.save();
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    cart.items = [];
    return cart.save();
  }
}
