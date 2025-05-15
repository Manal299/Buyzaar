import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';
import { createToken, setTokenCookie } from '../../../lib/auth';

export default async function handler(req, res) {
 
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  await connectToDatabase();
  
  try {
    const { email, password } = req.body;
    
   
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide email and password'
      });
    }
    
    
    const user = await User.findOne({ email }).select('+password');
    
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials'
      });
    }
    
    
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials'
      });
    }
    
    const token = createToken(user);
    
   
    setTokenCookie(res, token);
    
   
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