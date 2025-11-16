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

  const ensureCategory = async (data: Partial<Category> & { name: string }) => {
    let category = await repository.findOne({ where: { name: data.name } });
    if (category) {
      return category;
    }
    category = repository.create(data);
    return repository.save(category);
  };

  const mainCategoriesData = [
    { name: 'Smartphones', level: 0, isActive: true },
    { name: 'Laptops', level: 0, isActive: true },
    { name: 'Accessories', level: 0, isActive: true },
    { name: 'Occasions', level: 0, isActive: true },
  ];

  const categoryMap = new Map<string, Category>();

  for (const data of mainCategoriesData) {
    const category = await ensureCategory(data);
    categoryMap.set(category.name, category);
  }

  const subcategoriesData = [
    { name: 'Apple', parentName: 'Smartphones' },
    { name: 'Samsung', parentName: 'Smartphones' },
    { name: 'Xiaomi', parentName: 'Smartphones' },
    { name: 'Huawei', parentName: 'Smartphones' },
    { name: 'Google', parentName: 'Smartphones' },
    { name: 'OnePlus', parentName: 'Smartphones' },
    { name: 'Gaming Laptops', parentName: 'Laptops' },
    { name: 'Business Laptops', parentName: 'Laptops' },
    { name: 'Chargers', parentName: 'Accessories' },
    { name: 'Cables', parentName: 'Accessories' },
    { name: 'Certified Used', parentName: 'Occasions' },
    { name: 'Refurbished', parentName: 'Occasions' },
  ];

  for (const subcategory of subcategoriesData) {
    const parent = categoryMap.get(subcategory.parentName);
    if (!parent) continue;

    await ensureCategory({
      name: subcategory.name,
      parent,
      parentId: parent.id,
      level: 1,
      isActive: true,
    });
  }

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

