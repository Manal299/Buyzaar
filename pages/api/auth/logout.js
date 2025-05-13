import { clearTokenCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  // Only allow POST method for logout
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    // Clear the auth cookie
    clearTokenCookie(res);
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error during logout'
    });
  }
} 