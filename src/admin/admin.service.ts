import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SellersService } from '../sellers/sellers.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private sellersService: SellersService,
    // Note: To get stats, we might need direct access to models or extended services
    // For now, let's assume we use the existing services
  ) {}

  async getStatistics() {
    const users = await this.usersService.getAllUsers();
    const sellers = await this.sellersService.findAll();

    return {
      totalUsers: users.length,
      totalSellers: sellers.length,
      roles: {
        admin: users.filter((u) => u.role === 'ADMIN').length,
        seller: users.filter((u) => u.role === 'SELLER').length,
        buyer: users.filter((u) => u.role === 'BUYER').length,
      },
    };
  }
}
