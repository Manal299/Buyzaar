// scripts/seed-db.js - Script to seed the database with sample data
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buyzaar';
const DB_NAME = 'Buyzaar';

// Sample data
const categories = [
  { 
    _id: '5f8d0e0b9c4f0b1f7c9c0c0c', 
    name: 'Electronics', 
    slug: 'electronics',
    description: 'Electronic devices and gadgets'
  },
  { 
    _id: '5f8d0e0b9c4f0b1f7c9c0c0d', 
    name: 'Clothing', 
    slug: 'clothing',
    description: 'Fashionable apparel for all ages'
  },
  { 
    _id: '5f8d0e0b9c4f0b1f7c9c0c0e', 
    name: 'Home & Kitchen', 
    slug: 'home-kitchen',
    description: 'Everything for your home'
  },
  { 
    _id: '5f8d0e0b9c4f0b1f7c9c0c0f', 
    name: 'Books', 
    slug: 'books',
    description: 'Books of all genres'
  }
];

const users = [
  {
    _id: '5f8d0e0b9c4f0b1f7c9c0c01',
    name: 'John Seller',
    email: 'seller@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'seller',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '5f8d0e0b9c4f0b1f7c9c0c02',
    name: 'Jane Buyer',
    email: 'buyer@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'buyer',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '5f8d0e0b9c4f0b1f7c9c0c03',
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const products = [
  {
    _id: '5f8d0e0b9c4f0b1f7c9c0c10',
    seller: '5f8d0e0b9c4f0b1f7c9c0c01',
    name: 'Smartphone X',
    description: 'Latest smartphone with amazing features and long battery life.',
    price: 799.99,
    originalPrice: 899.99,
    discount: 11,
    category: '5f8d0e0b9c4f0b1f7c9c0c0c',
    inventory: 100,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1160&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1972&auto=format&fit=crop'
    ],
    rating: {
      average: 4.7,
      count: 127
    },
    status: 'active',
    featured: true,
    tags: ['smartphone', 'tech', 'mobile'],
    specifications: {
      processor: 'Octa-core',
      ram: '8GB',
      storage: '128GB',
      display: '6.5-inch AMOLED'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '5f8d0e0b9c4f0b1f7c9c0c11',
    seller: '5f8d0e0b9c4f0b1f7c9c0c01',
    name: 'Classic T-Shirt',
    description: 'Comfortable cotton t-shirt for everyday wear.',
    price: 29.99,
    category: '5f8d0e0b9c4f0b1f7c9c0c0d',
    inventory: 250,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop'
    ],
    rating: {
      average: 4.5,
      count: 89
    },
    status: 'active',
    featured: false,
    tags: ['clothing', 'casual', 't-shirt'],
    specifications: {
      material: '100% Cotton',
      size: 'M',
      color: 'Black'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '5f8d0e0b9c4f0b1f7c9c0c12',
    seller: '5f8d0e0b9c4f0b1f7c9c0c01',
    name: 'Coffee Maker Deluxe',
    description: 'Premium coffee maker for the perfect brew every morning.',
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    category: '5f8d0e0b9c4f0b1f7c9c0c0e',
    inventory: 50,
    images: [
      'https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=1471&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572119865084-43c285814d63?q=80&w=1470&auto=format&fit=crop'
    ],
    rating: {
      average: 4.8,
      count: 64
    },
    status: 'active',
    featured: true,
    tags: ['kitchen', 'coffee', 'appliance'],
    specifications: {
      capacity: '1.5L',
      power: '1000W',
      color: 'Silver'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '5f8d0e0b9c4f0b1f7c9c0c13',
    seller: '5f8d0e0b9c4f0b1f7c9c0c01',
    name: 'Bestselling Novel',
    description: 'Award-winning fiction novel that has topped charts worldwide.',
    price: 19.99,
    category: '5f8d0e0b9c4f0b1f7c9c0c0f',
    inventory: 120,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1974&auto=format&fit=crop'
    ],
    rating: {
      average: 4.9,
      count: 215
    },
    status: 'active',
    featured: false,
    tags: ['book', 'fiction', 'bestseller'],
    specifications: {
      author: 'Jane Doe',
      pages: '432',
      language: 'English'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '5f8d0e0b9c4f0b1f7c9c0c14',
    seller: '5f8d0e0b9c4f0b1f7c9c0c01',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation.',
    price: 129.99,
    originalPrice: 159.99,
    discount: 19,
    category: '5f8d0e0b9c4f0b1f7c9c0c0c',
    inventory: 75,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?q=80&w=1974&auto=format&fit=crop'
    ],
    rating: {
      average: 4.6,
      count: 82
    },
    status: 'active',
    featured: true,
    tags: ['audio', 'headphones', 'wireless'],
    specifications: {
      batteryLife: '20 hours',
      connectivity: 'Bluetooth 5.0',
      type: 'Over-ear'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Function to seed the database
async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Delete existing data
    await db.collection('users').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});
    
    // Insert new data
    await db.collection('users').insertMany(users);
    await db.collection('categories').insertMany(categories);
    await db.collection('products').insertMany(products);
    
    console.log('Database seeded successfully!');
    console.log(`Inserted ${users.length} users`);
    console.log(`Inserted ${categories.length} categories`);
    console.log(`Inserted ${products.length} products`);
    
    console.log('\nSample login credentials:');
    console.log('Seller: seller@example.com / password123');
    console.log('Buyer: buyer@example.com / password123');
    console.log('Admin: admin@example.com / password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seed function
seedDatabase().catch(console.error); 