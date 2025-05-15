import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {

  res.setHeader('Content-Type', 'application/json');
  
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    
    await connectToDatabase();
    
    const { name, email, password, role = 'buyer' } = req.body;
    
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide all required fields'
      });
    }
    
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is already registered'
      });
    }
    
   
    if (role !== 'buyer' && role !== 'seller') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid role specified'
      });
    }
    
   
    const user = await User.create({
      name,
      email,
      password,
      role,
      
    });
    
    
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt
    };
    
   
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