import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-should-be-in-env-for-production';
const JWT_EXPIRES_IN = '7d';

export function createToken(user) {

  const payload = {
    id: user._id,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}


export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.log('Token verification error:', error.message);
   
    return null;
  }
}


export function setTokenCookie(res, token) {
  const cookie = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  });

  res.setHeader('Set-Cookie', cookie);
  return res;
}


export function clearTokenCookie(res) {
  const cookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: -1,
    path: '/'
  });

  res.setHeader('Set-Cookie', cookie);
  return res;
}

// Authentication middleware for API routes
export async function authMiddleware(req, res, next) {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    // Add decoded token to request
    req.user = decoded;
    
    // Continue to next middleware/handler
    if (typeof next === 'function') {
      return next();
    }
    
    return true;
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ success: false, error: 'Authentication error' });
  }
}

// Role-based access control middleware
export function requireRole(roles = []) {
  // Convert string to array if single role
  if (typeof roles === 'string') {
    roles = [roles];
  }

  // Return middleware function
  return (req, res, next) => {
    // Check if user exists and has a role that is allowed
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access forbidden. You do not have the required permissions'
      });
    }

    // Continue
    if (typeof next === 'function') {
      return next();
    }
    
    return true;
  };
} 