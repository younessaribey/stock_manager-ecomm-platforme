import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) {}

  async findAll(): Promise<Setting[]> {
    return this.settingsRepository.find();
  }

  async findByKey(key: string): Promise<Setting> {
    const setting = await this.settingsRepository.findOne({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }

    return setting;
  }

  async update(key: string, updateSettingDto: UpdateSettingDto): Promise<Setting> {
    let setting = await this.settingsRepository.findOne({
      where: { key },
    });

    if (!setting) {
      // Create new setting if doesn't exist
      setting = this.settingsRepository.create({
        key,
        ...updateSettingDto,
      });
    } else {
      Object.assign(setting, updateSettingDto);
    }

    return this.settingsRepository.save(setting);
  }

  async bulkUpdate(settings: { key: string; value: string }[]): Promise<Setting[]> {
    const updatedSettings: Setting[] = [];

    for (const { key, value } of settings) {
      const updated = await this.update(key, { value });
      updatedSettings.push(updated);
    }

    return updatedSettings;
  }

  async remove(key: string): Promise<void> {
    const setting = await this.findByKey(key);
    await this.settingsRepository.remove(setting);
  }
}
