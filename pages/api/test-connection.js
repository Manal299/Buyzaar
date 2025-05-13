import connectToDatabase from '../../lib/mongoose';

export default async function handler(req, res) {
  try {
    // Test database connection
    await connectToDatabase();
    
    res.status(200).json({ 
      success: true, 
      message: 'MongoDB connection successful' 
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to connect to MongoDB', 
      error: error.message 
    });
  }
} 