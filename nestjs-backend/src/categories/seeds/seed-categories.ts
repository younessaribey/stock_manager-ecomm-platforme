import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from '../../config/typeorm.config';
import { Category } from '../entities/category.entity';

config({ path: resolve(process.cwd(), '.env') });

const configService = new ConfigService();
const typeOrmConfigService = new TypeOrmConfigService(configService);
const baseOptions = typeOrmConfigService.createTypeOrmOptions() as DataSourceOptions;
const dataSource = new DataSource({
  ...baseOptions,
  entities: baseOptions.entities ?? [Category],
});

async function seedCategories() {
  await dataSource.initialize();
  const repository = dataSource.getRepository(Category);

  const existingCount = await repository.count();
  if (existingCount > 0) {
    console.log(`Categories already exist (${existingCount}). Skipping seed.`);
    await dataSource.destroy();
    return;
  }

  const mainCategoriesData = [
    { name: 'Smartphones', level: 0, isActive: true },
    { name: 'Laptops', level: 0, isActive: true },
    { name: 'Accessories', level: 0, isActive: true },
    { name: 'Occasions', level: 0, isActive: true },
  ];

  const mainCategories = await repository.save(mainCategoriesData);
  const categoryMap = new Map<string, Category>();
  mainCategories.forEach((category) => categoryMap.set(category.name, category));

  const subcategoriesData = [
    { name: 'Apple', parent: categoryMap.get('Smartphones')!, level: 1, isActive: true },
    { name: 'Samsung', parent: categoryMap.get('Smartphones')!, level: 1, isActive: true },
    { name: 'Xiaomi', parent: categoryMap.get('Smartphones')!, level: 1, isActive: true },
    { name: 'Gaming Laptops', parent: categoryMap.get('Laptops')!, level: 1, isActive: true },
    { name: 'Business Laptops', parent: categoryMap.get('Laptops')!, level: 1, isActive: true },
    { name: 'Chargers', parent: categoryMap.get('Accessories')!, level: 1, isActive: true },
    { name: 'Cables', parent: categoryMap.get('Accessories')!, level: 1, isActive: true },
    { name: 'Certified Used', parent: categoryMap.get('Occasions')!, level: 1, isActive: true },
    { name: 'Refurbished', parent: categoryMap.get('Occasions')!, level: 1, isActive: true },
  ];

  await repository.save(subcategoriesData);
  console.log('✅ Seeded categories and subcategories successfully.');
  await dataSource.destroy();
}

seedCategories()
  .then(() => {
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('❌ Failed to seed categories:', error);
    await dataSource.destroy();
    process.exit(1);
  });

