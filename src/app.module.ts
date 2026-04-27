import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { SellersModule } from './sellers/sellers.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AdminModule } from './admin/admin.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://zoyidjonnasretdinovcoder_db_user:jh0VCjpyUINdrGoi@cluster0.i21hfxy.mongodb.net/?appName=Cluster0',
    ),
    AuthModule,
    UsersModule,
    SellersModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ReviewsModule,
    AdminModule,
    WishlistModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
