import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  // Set JSON content type
  res.setHeader('Content-Type', 'application/json');
  
  // Only allow POST method for signup
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    // Connect to database
    await connectToDatabase();
    
    const { name, email, password, role = 'buyer' } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide all required fields'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is already registered'
      });
    }
    
    // Validate role (only allow buyer or seller for registration)
    if (role !== 'buyer' && role !== 'seller') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid role specified'
      });
    }
    
    // Create new user with status (automatically set based on role in the model)
    const user = await User.create({
      name,
      email,
      password,
      role,
      // status will be set by the default function in the model:
      // 'pending' for sellers, 'active' for others
    });
    
    // Return user without password
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt
    };
    
    // Log successful signup for debugging
    console.log(`User ${email} signed up successfully with role: ${role}, status: ${user.status}`);
    
    return res.status(201).json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error during registration: ' + error.message
    });
  }
} 