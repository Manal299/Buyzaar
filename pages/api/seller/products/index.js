import connectToDatabase from '../../../../lib/mongoose';
import Product from '../../../../models/Product';

export default async function handler(req, res) {
  await connectToDatabase();
  
  // Set a mock seller ID for testing purposes
  // In a real app, this would come from authentication
  const mockSellerId = '6507f6ced29bf8f40acad3d2';
  
  switch (req.method) {
    case 'GET':
      try {
        // Add filter and pagination support
        const { category, subcategory, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
        
        // Build filter object
        const filter = { sellerId: mockSellerId };
        
        if (category) filter.category = category;
        if (subcategory) filter.subcategory = subcategory;
        
        // Price range filter
        if (minPrice || maxPrice) {
          filter.price = {};
          if (minPrice) filter.price.$gte = Number(minPrice);
          if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        
        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        
        // Get total count for pagination info
        const total = await Product.countDocuments(filter);
        
        // Get products with pagination
        const products = await Product.find(filter)
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 }); // Newest first
        
        res.status(200).json({ 
          success: true, 
          data: products,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit))
          }
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'POST':
      try {
        // Validate required fields
        const { name, description, price, images, category, subcategory } = req.body;
        
        if (!name || !description || !price || !images || !category || !subcategory) {
          return res.status(400).json({ 
            success: false, 
            message: 'Required fields missing' 
          });
        }
        
        // Ensure images is an array
        const productImages = Array.isArray(images) ? images : [images];
        
        // Create the product with the updated schema
        const product = await Product.create({
          ...req.body,
          images: productImages,
          sellerId: mockSellerId
        });
        
        res.status(201).json({ success: true, data: product });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
} 