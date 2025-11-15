/**
 * STEP 6: Settings Module (Skeleton)
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';
// TODO: Create SettingsService and SettingsController

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  // TODO: Add controllers and providers
})
export class SettingsModule {}
