import connectToDatabase from '../../lib/mongoose';
import Product from '../../models/Product';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    
    // Create a mock product to test the updated schema
    const testProduct = {
      name: "Test Product with Multiple Images",
      description: "This is a test product with multiple images, sizes, and colors",
      price: 29.99,
      images: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
        "https://example.com/image3.jpg"
      ],
      category: "Electronic Accessories",
      subcategory: "Mobile Accessories",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White", "Red", "Blue"],
      stock: 100,
      sellerId: new mongoose.Types.ObjectId("6507f6ced29bf8f40acad3d2") // Using the mock ID
    };
    
    // Delete any existing test products to avoid duplicates
    await Product.deleteMany({ name: testProduct.name });
    
    // Create the test product
    const product = await Product.create(testProduct);
    
    res.status(200).json({ 
      success: true, 
      message: 'Test product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating test product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create test product', 
      error: error.message 
    });
  }
} 