import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SellerProfile, SellerStatus } from './schemas/seller-profile.schema';

@Injectable()
export class SellersService {
  constructor(
    @InjectModel(SellerProfile.name) private sellerModel: Model<SellerProfile>,
  ) {}

  async createProfile(userId: string, profileDto: any) {
    const profile = new this.sellerModel({
      ...profileDto,
      userId: new Types.ObjectId(userId),
    });
    return profile.save();
  }

  async findByUserId(userId: string) {
    return this.sellerModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
  }

  async updateStatus(id: string, status: SellerStatus) {
    return this.sellerModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  async increaseBalance(userId: string, amount: number) {
    return this.sellerModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $inc: { balance: amount } },
        { new: true },
      )
      .exec();
  }

  async findAll() {
    return this.sellerModel.find().populate('userId', 'fullName email').exec();
  }
}
