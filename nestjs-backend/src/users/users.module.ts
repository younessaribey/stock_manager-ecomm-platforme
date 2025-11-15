/**
 * STEP 6: Users Module
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register User entity
  providers: [UsersService], // Register service
  exports: [UsersService], // Export so AuthModule can use it
})
export class UsersModule {}
