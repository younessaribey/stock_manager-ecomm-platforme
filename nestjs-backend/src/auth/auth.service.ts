/**
 * STEP 3: Auth Service
 *
 * Contains authentication business logic:
 * - Register new users
 * - Login users
 * - Generate JWT tokens
 *
 * In Express, this was in authController.js
 */

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // Inject JWT service
  ) {}

  /**
   * Register new user
   * Similar to Express: register function
   */
  async register(registerDto: RegisterDto) {
    const { email, password, name, username } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name: name || username || email.split('@')[0],
      role: 'user',
      approved: false,
    });

    // Generate token
    const token = this.generateToken(user);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Login user
   * Similar to Express: login function
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Generate JWT token
   * Similar to your generateToken function
   */
  private generateToken(user: { id: number; email: string; role: string }): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  /**
   * Validate user (for JWT strategy)
   */
  async validateUser(userId: number) {
    return this.usersService.findOne(userId);
  }
}
