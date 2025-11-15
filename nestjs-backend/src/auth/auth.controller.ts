/**
 * STEP 4: Auth Controller
 *
 * Controllers handle HTTP requests.
 * They're like Express routes.
 *
 * In Express:
 *   router.post('/register', register);
 *
 * In NestJS:
 *   @Post('register')
 *   register(@Body() dto: RegisterDto) { ... }
 *
 * Key Decorators:
 * - @Controller('auth') - Route prefix (/api/auth)
 * - @Post(), @Get(), etc. - HTTP methods
 * - @Body() - Get request body
 * - @Public() - Mark as public route (no auth)
 */

import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth') // All routes start with /api/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/register
   * Public route - no authentication needed
   */
  @Public() // Mark as public (no JWT required)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // DTO is automatically validated by ValidationPipe
    // If invalid, NestJS returns 400 error automatically
    return this.authService.register(registerDto);
  }

  /**
   * POST /api/auth/login
   * Public route
   */
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * GET /api/auth/me
   * Protected route - requires JWT token
   */
  @UseGuards(JwtAuthGuard) // Require authentication
  @Get('me')
  async getCurrentUser(@Request() req) {
    // req.user is set by JwtAuthGuard (from JWT strategy)
    const { password, ...userWithoutPassword } = req.user;
    return userWithoutPassword;
  }
}
