import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';
import { createToken, setTokenCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  // Only allow POST method for login
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  // Connect to database
  await connectToDatabase();
  
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide email and password'
      });
    }
    
    // Find user by email and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials'
      });
    }
    
    // Verify password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = createToken(user);
    
    // Set token in cookie
    setTokenCookie(res, token);
    
    // Return user without password
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
    
    return res.status(200).json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error during login'
    });
  }
} 