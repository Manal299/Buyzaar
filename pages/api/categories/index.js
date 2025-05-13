import connectToDatabase from '../../../lib/mongoose';
import Category from '../../../models/Category';

// Categories data for initial seeding
const categoriesData = {
  "Electronic Accessories": ["Mobile Accessories", "Wearable", "Computer Accessories"],
  "TV & Home Appliances": ["Smart TVs", "Refrigerators", "Washing Machines"],
  "Health & Beauty": ["Makeup", "Skincare", "Hair Care", "Personal Care Devices"],
  "Mother & Baby": ["Diapers", "Baby Gear", "Feeding", "Toys"],
  "Electronic Devices": ["Smartphones", "Tablets", "Laptops"],
  "Groceries & Pets": ["Dry Food", "Wet Food", "Treats"],
  "Home & Lifestyle": ["Furniture", "Lighting", "Tools & Home Improvement"],
  "Women's Fashion": ["Dresses", "Tops", "Shoes", "Handbags"],
  "Men's Fashion": ["Shirts", "Jackets", "Shoes", "Watches"],
  "Watches, Bags & Jewellery": ["Watches", "Bags", "Necklaces", "Bracelets"],
  "Sports & Outdoor": ["Exercise & Fitness", "Cycling", "Outdoor Recreation"],
  "Automotive & Motorbike": ["Motorcycle Parts", "Car Accessories", "Oils & Fluids"]
};

export default async function handler(req, res) {
  await connectToDatabase();
  
  switch (req.method) {
    case 'GET':
      try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.status(200).json({ success: true, data: categories });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'POST':
      // This will be used to seed the categories if they don't exist
      try {
        // Clear existing categories if force parameter is set
        if (req.query.force === 'true') {
          await Category.deleteMany({});
        }
        
        // Check if categories already exist
        const count = await Category.countDocuments();
        
        if (count === 0) {
          // Format the data for bulk insertion
          const categoriesToInsert = Object.entries(categoriesData).map(([name, subcategories]) => ({
            name,
            subcategories
          }));
          
          const insertedCategories = await Category.insertMany(categoriesToInsert);
          res.status(201).json({ 
            success: true, 
            message: 'Categories seeded successfully', 
            data: insertedCategories 
          });
        } else {
          res.status(200).json({ 
            success: true, 
            message: 'Categories already exist. Use ?force=true to reseed.' 
          });
        }
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
} 