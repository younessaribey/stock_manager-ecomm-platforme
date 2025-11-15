import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Request() req) {
    return this.wishlistService.findByUser(req.user.id);
  }

  @Post(':productId')
  addToWishlist(@Request() req, @Param('productId') productId: string) {
    return this.wishlistService.addToWishlist(req.user.id, +productId);
  }

  @Delete(':productId')
  removeFromWishlist(@Request() req, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(req.user.id, +productId);
  }

  @Delete()
  clearWishlist(@Request() req) {
    return this.wishlistService.clearWishlist(req.user.id);
  }
}
