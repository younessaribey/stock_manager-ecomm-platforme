import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class DashboardService {
  constructor(
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private usersService: UsersService,
  ) {}

  async getStats() {
    // Get product stats
    const products = await this.productsService.findAll();
    const totalProducts = products.length;
    const lowStockProducts = products.filter((p) => p.quantity < 10).length;

    // Get user stats
    const users = await this.usersService.findAll();
    const totalUsers = users.length;
    const adminUsers = users.filter((u) => u.role === 'admin').length;

    // Get all orders from all users
    const allOrdersPromises = users.map((user) =>
      this.ordersService.findAll(user.id).catch(() => []),
    );
    const allOrdersArrays = await Promise.all(allOrdersPromises);
    const orders = allOrdersArrays.flat();

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const completedOrders = orders.filter((o) => o.status === 'completed').length;

    // Calculate total revenue
    const totalRevenue = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, order) => sum + Number(order.total), 0);

    // Recent orders
    const recentOrders = orders.slice(0, 5);

    return {
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        revenue: totalRevenue,
      },
      users: {
        total: totalUsers,
        admins: adminUsers,
      },
      recentOrders,
    };
  }
}
