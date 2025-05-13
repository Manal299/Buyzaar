import connectToDatabase from '../../../../lib/mongoose';
import Product from '../../../../models/Product';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const { id } = req.query;
  
  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }
  
  await connectToDatabase();
  
  // Set a mock seller ID for testing purposes
  // In a real app, this would come from authentication
  const mockSellerId = '6507f6ced29bf8f40acad3d2';
  
  switch (req.method) {
    case 'GET':
      try {
        const product = await Product.findOne({ 
          _id: id,
          sellerId: mockSellerId 
        });
        
        if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        res.status(200).json({ success: true, data: product });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'PUT':
      try {
        // Handle images array
        if (req.body.images && !Array.isArray(req.body.images)) {
          req.body.images = [req.body.images];
        }
        
        // Handle sizes array
        if (req.body.sizes && !Array.isArray(req.body.sizes)) {
          req.body.sizes = [req.body.sizes];
        }
        
        // Handle colors array
        if (req.body.colors && !Array.isArray(req.body.colors)) {
          req.body.colors = [req.body.colors];
        }
        
        const product = await Product.findOneAndUpdate(
          { _id: id, sellerId: mockSellerId },
          req.body,
          { new: true, runValidators: true }
        );
        
        if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        res.status(200).json({ success: true, data: product });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'DELETE':
      try {
        const deletedProduct = await Product.findOneAndDelete({ 
          _id: id,
          sellerId: mockSellerId 
        });
        
        if (!deletedProduct) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
} 