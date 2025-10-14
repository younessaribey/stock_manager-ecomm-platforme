// Mock data for testing and development
export const mockCategories = [
  {
    id: 1,
    name: 'Smartphones',
    level: 0,
    parentId: null,
    isActive: true,
    subcategories: [
      { id: 11, name: 'iPhone', level: 1, parentId: 1, isActive: true },
      { id: 12, name: 'Samsung Galaxy', level: 1, parentId: 1, isActive: true },
      { id: 13, name: 'Google Pixel', level: 1, parentId: 1, isActive: true }
    ]
  },
  {
    id: 2,
    name: 'Tablets',
    level: 0,
    parentId: null,
    isActive: true,
    subcategories: [
      { id: 21, name: 'iPad', level: 1, parentId: 2, isActive: true },
      { id: 22, name: 'Android Tablets', level: 1, parentId: 2, isActive: true }
    ]
  },
  {
    id: 3,
    name: 'Laptops',
    level: 0,
    parentId: null,
    isActive: true,
    subcategories: [
      { id: 31, name: 'MacBook', level: 1, parentId: 3, isActive: true },
      { id: 32, name: 'Windows Laptops', level: 1, parentId: 3, isActive: true }
    ]
  },
  {
    id: 4,
    name: 'Accessories',
    level: 0,
    parentId: null,
    isActive: true,
    subcategories: [
      { id: 41, name: 'Cases', level: 1, parentId: 4, isActive: true },
      { id: 42, name: 'Chargers', level: 1, parentId: 4, isActive: true },
      { id: 43, name: 'Headphones', level: 1, parentId: 4, isActive: true }
    ]
  }
];

export const mockProducts = [
  {
    id: 1,
    name: 'iPhone 14 Pro',
    description: 'Latest iPhone with Pro camera system',
    price: 999.99,
    quantity: 15,
    categoryId: 11,
    category: { id: 11, name: 'iPhone' },
    imageUrl: '/assets/product-md.jpg',
    storage: '128GB',
    color: 'Space Black',
    condition: 'new',
    batteryHealth: 100
  },
  {
    id: 2,
    name: 'Samsung Galaxy S23',
    description: 'Premium Android smartphone',
    price: 799.99,
    quantity: 8,
    categoryId: 12,
    category: { id: 12, name: 'Samsung Galaxy' },
    imageUrl: '/assets/product-md.jpg',
    storage: '256GB',
    color: 'Phantom Black',
    condition: 'new',
    batteryHealth: null
  },
  {
    id: 3,
    name: 'iPad Air',
    description: 'Powerful tablet for work and play',
    price: 599.99,
    quantity: 12,
    categoryId: 21,
    category: { id: 21, name: 'iPad' },
    imageUrl: '/assets/product-md.jpg',
    storage: '64GB',
    color: 'Space Gray',
    condition: 'new',
    batteryHealth: null
  },
  {
    id: 4,
    name: 'MacBook Pro 14"',
    description: 'Professional laptop with M2 chip',
    price: 1999.99,
    quantity: 5,
    categoryId: 31,
    category: { id: 31, name: 'MacBook' },
    imageUrl: '/assets/product-md.jpg',
    storage: '512GB SSD',
    color: 'Silver',
    condition: 'new',
    batteryHealth: null
  },
  {
    id: 5,
    name: 'iPhone 13',
    description: 'Previous generation iPhone, great value',
    price: 699.99,
    quantity: 20,
    categoryId: 11,
    category: { id: 11, name: 'iPhone' },
    imageUrl: '/assets/product-md.jpg',
    storage: '128GB',
    color: 'Blue',
    condition: 'refurbished',
    batteryHealth: 95
  },
  {
    id: 6,
    name: 'AirPods Pro',
    description: 'Premium wireless earbuds with noise cancellation',
    price: 249.99,
    quantity: 30,
    categoryId: 43,
    category: { id: 43, name: 'Headphones' },
    imageUrl: '/assets/product-md.jpg',
    color: 'White',
    condition: 'new',
    batteryHealth: null
  },
  {
    id: 7,
    name: 'Google Pixel 7',
    description: 'Pure Android experience with great camera',
    price: 599.99,
    quantity: 10,
    categoryId: 13,
    category: { id: 13, name: 'Google Pixel' },
    imageUrl: '/assets/product-md.jpg',
    storage: '128GB',
    color: 'Obsidian',
    condition: 'new',
    batteryHealth: null
  },
  {
    id: 8,
    name: 'Phone Case - Universal',
    description: 'Protective case for most smartphones',
    price: 19.99,
    quantity: 50,
    categoryId: 41,
    category: { id: 41, name: 'Cases' },
    imageUrl: '/assets/product-md.jpg',
    color: 'Clear',
    condition: 'new',
    batteryHealth: null
  }
];

// Helper function to get products by category
export const getProductsByCategory = (categoryId, includeSubcategories = false) => {
  if (includeSubcategories) {
    const category = mockCategories.find(cat => cat.id === categoryId);
    if (category && category.subcategories) {
      const subcategoryIds = category.subcategories.map(sub => sub.id);
      return mockProducts.filter(product => 
        product.categoryId === categoryId || subcategoryIds.includes(product.categoryId)
      );
    }
  }
  return mockProducts.filter(product => product.categoryId === categoryId);
};

// Helper function to search products
export const searchProducts = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(term) ||
    (product.description && product.description.toLowerCase().includes(term))
  );
};

export default {
  categories: mockCategories,
  products: mockProducts,
  getProductsByCategory,
  searchProducts
};
