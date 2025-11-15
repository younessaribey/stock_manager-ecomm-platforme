/**
 * STEP 6: Auth Module
 *
 * Modules organize related code together.
 * They define:
 * - What controllers to use
 * - What services to use
 * - What other modules to import
 * - What to export (make available to other modules)
 *
 * This is like organizing your Express routes into separate files,
 * but more structured with dependency injection.
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    // Import UsersModule to use UsersService
    UsersModule,

    // Import User entity for repository access
    TypeOrmModule.forFeature([User]),

    // Configure Passport for JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configure JWT module
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRE') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController], // Register controller
  providers: [AuthService, JwtStrategy], // Register services and strategies
  exports: [AuthService], // Export so other modules can use AuthService
})
export class AuthModule {}
