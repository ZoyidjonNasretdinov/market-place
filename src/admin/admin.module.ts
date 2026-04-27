import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { SellersModule } from '../sellers/sellers.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [UsersModule, SellersModule, OrdersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
