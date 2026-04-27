import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist } from './schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<Wishlist>,
  ) {}

  async getWishlist(userId: string) {
    let wishlist = await this.wishlistModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('products')
      .exec();
    if (!wishlist) {
      wishlist = new this.wishlistModel({
        userId: new Types.ObjectId(userId),
        products: [],
      });
      await wishlist.save();
    }
    return wishlist;
  }

  async toggleWishlist(userId: string, productId: string) {
    const wishlist = await this.getWishlist(userId);
    const prodId = new Types.ObjectId(productId);

    const index = wishlist.products.findIndex(
      (id) => id.toString() === productId,
    );
    if (index > -1) {
      wishlist.products.splice(index, 1);
    } else {
      wishlist.products.push(prodId);
    }
    return wishlist.save();
  }
}
