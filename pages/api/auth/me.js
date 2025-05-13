import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';
import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    
    await connectToDatabase();
    
    const user = await User.findById(session.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        isOnboarded: user.isOnboarded
      }
    });
  } catch (error) {
    console.error('Error in me API:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
} 