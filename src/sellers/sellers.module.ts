import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import {
  SellerProfile,
  SellerProfileSchema,
} from './schemas/seller-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SellerProfile.name, schema: SellerProfileSchema },
    ]),
  ],
  controllers: [SellersController],
  providers: [SellersService],
  exports: [SellersService, MongooseModule],
})
export class SellersModule {}
