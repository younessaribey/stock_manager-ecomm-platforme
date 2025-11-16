import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from '../../config/typeorm.config';
import { Product } from '../entities/product.entity';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

config({ path: resolve(process.cwd(), '.env') });

const configService = new ConfigService();
const typeOrmConfigService = new TypeOrmConfigService(configService);
const baseOptions = typeOrmConfigService.createTypeOrmOptions() as DataSourceOptions;
const dataSource = new DataSource({
  ...baseOptions,
  entities: baseOptions.entities ?? [Product, Category, User],
});

type SeedProduct = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryName: string;
  condition: 'new' | 'used' | 'refurbished';
  storage?: string;
  color?: string;
  model?: string;
  batteryHealth?: number;
  status?: 'available' | 'pending' | 'sold';
  imageUrl: string;
  gallery?: string[];
};

const productsToSeed: SeedProduct[] = [
  {
    name: 'iPhone 15 Pro Max – Titanium Blue (512GB)',
    description:
      'Flagship Apple smartphone with A17 Pro chip, 512GB storage, 8GB RAM, and a stunning triple-lens camera. Premium condition with full accessory kit.',
    price: 329000,
    quantity: 6,
    categoryName: 'Apple',
    condition: 'new',
    storage: '512GB',
    color: 'Blue Titanium',
    model: 'A3102',
    batteryHealth: 100,
    imageUrl:
      'https://images.unsplash.com/photo-1695048133142-86475cf3d8ff?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1691722484696-c98b03f3ca3a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1695048133034-dd5bbf5f991f?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    name: 'Samsung Galaxy S24 Ultra (Graphite – 256GB)',
    description:
      'Brand new Galaxy S24 Ultra with the latest Snapdragon processor, S-Pen support, and 200MP camera. Unlocked and ready for Algerian carriers.',
    price: 279000,
    quantity: 8,
    categoryName: 'Samsung',
    condition: 'new',
    storage: '256GB',
    color: 'Graphite',
    model: 'SM-S928B',
    batteryHealth: 100,
    imageUrl:
      'https://images.unsplash.com/photo-1610792516820-06d3c7b3f1d4?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    name: 'Huawei Mate 60 Pro (Green – 512GB)',
    description:
      'Elegant Huawei Mate 60 Pro imported version with triple camera XMAGE system, satellite call support, and 512GB storage.',
    price: 248000,
    quantity: 4,
    categoryName: 'Huawei',
    condition: 'new',
    storage: '512GB',
    color: 'Green',
    model: 'ALN-AL00',
    batteryHealth: 100,
    imageUrl:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    name: 'Xiaomi Redmi Note 13 Pro+ (Aurora Purple)',
    description:
      'Great value Xiaomi Redmi Note 13 Pro+ with curved AMOLED 120Hz screen, 200MP camera, and 120W HyperCharge. Includes official warranty.',
    price: 118500,
    quantity: 12,
    categoryName: 'Xiaomi',
    condition: 'new',
    storage: '256GB',
    color: 'Aurora Purple',
    model: '2312DRA50G',
    batteryHealth: 100,
    imageUrl:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Google Pixel 8 Pro (Obsidian – 128GB)',
    description:
      'Photography powerhouse with Google Tensor G3, pro camera controls, and 7 years of OS updates. Perfect for creators.',
    price: 235000,
    quantity: 5,
    categoryName: 'Google',
    condition: 'new',
    storage: '128GB',
    color: 'Obsidian',
    model: 'GA04852-US',
    batteryHealth: 100,
    imageUrl:
      'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'OnePlus 12 (Flowy Emerald – 16/512GB)',
    description:
      'Latest OnePlus flagship with Snapdragon 8 Gen 3, 16GB RAM, 512GB storage, and Hasselblad tuned cameras. Supports SUPERVOOC 100W.',
    price: 214900,
    quantity: 7,
    categoryName: 'OnePlus',
    condition: 'new',
    storage: '512GB',
    color: 'Flowy Emerald',
    model: 'CPH2581',
    batteryHealth: 100,
    imageUrl:
      'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80',
  },
];

const generateImei = (prefix: string) => {
  const random = Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000;
  return `${prefix}${random}`;
};

async function seedProducts() {
  await dataSource.initialize();

  const productRepository = dataSource.getRepository(Product);
  const categoryRepository = dataSource.getRepository(Category);
  const userRepository = dataSource.getRepository(User);

  const adminUser =
    (await userRepository.findOne({ where: { role: 'admin', approved: true } })) ||
    (await userRepository.findOne({ where: { role: 'admin' } }));

  if (!adminUser) {
    throw new Error('No admin user found. Please create an admin before seeding products.');
  }

  for (const data of productsToSeed) {
    const existing = await productRepository.findOne({ where: { name: data.name } });
    if (existing) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const category = await categoryRepository.findOne({ where: { name: data.categoryName } });
    if (!category) {
      console.warn(`⚠️ Category "${data.categoryName}" not found. Skipping ${data.name}.`);
      // eslint-disable-next-line no-continue
      continue;
    }

    const product = productRepository.create({
      name: data.name,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
      categoryId: category.id,
      createdBy: adminUser.id,
      condition: data.condition,
      storage: data.storage,
      color: data.color,
      model: data.model,
      batteryHealth: data.batteryHealth,
      status: data.status ?? 'available',
      imageUrl: data.imageUrl,
      images: data.gallery ? JSON.stringify(data.gallery) : null,
      imei: generateImei(data.categoryName.substring(0, 3).toUpperCase()),
    });

    await productRepository.save(product);
    console.log(`✅ Added product: ${product.name}`);
  }

  await dataSource.destroy();
  console.log('🎉 Product seeding complete!');
}

seedProducts()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error('❌ Failed to seed products:', error);
    await dataSource.destroy();
    process.exit(1);
  });

