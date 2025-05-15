import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';


const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  error: null,
});


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authChecked = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // Prevent multiple auth checks
    if (authChecked.current) return;
    
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        setLoading(true);
        const res = await fetch('/api/auth/me');
        
        // Check if the response is JSON before trying to parse it
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Non-JSON response received from /api/auth/me');
          setUser(null);
          return;
        }
        
        if (res.ok) {
          const data = await res.json();
          console.log('Auth check success, user:', data.data);
          setUser(data.data);
        } else {
          // If not authenticated, user will be null
          console.log('Not authenticated');
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
      } finally {
        setLoading(false);
        authChecked.current = true;
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting login...');

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Check if the response is JSON before trying to parse it
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error: Invalid response format');
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log('Login successful:', data.user);
      // Set user in state
      setUser(data.user);

      // Handle redirects after login
      handleRedirectAfterAuth(data.user);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting signup...');

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      // Check if the response is JSON before trying to parse it
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error: Invalid response format');
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      console.log('Signup successful:', data.user);
      // Set user in state
      setUser(data.user);

      // For seller accounts, bypass the context redirects and use hard navigation
      if (data.user.role === 'seller') {
        console.log('Seller signup successful - preparing redirect to onboarding');
        
        // Use setTimeout to ensure the cookie is set before redirecting
        setTimeout(() => {
          console.log('Redirecting new seller to onboarding');
          // Force a hard redirect to avoid middleware interference
          window.location.href = '/seller/onboarding';
        }, 100);
        
        return { success: true }; // Return early
      } else {
        // For non-seller accounts, use the router
        router.push('/');
      }

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Handle redirects after authentication
  const handleRedirectAfterAuth = (user) => {
    // If we're already on a page based on the user's role, don't redirect
    const currentPath = router.pathname;
    
    if (user.role === 'seller') {
      // Check if seller has completed onboarding
      if (!user.storeInfo || !user.storeInfo.isOnboarded) {
        console.log('Seller needs onboarding, redirecting');
        router.push('/seller/onboarding');
      } else if (!currentPath.startsWith('/seller')) {
        console.log('Redirecting seller to dashboard');
        router.push('/seller/dashboard');
      }
    } else if (user.role === 'admin' && !currentPath.startsWith('/admin')) {
      console.log('Redirecting admin to dashboard');
      router.push('/admin/dashboard');
    } else if (user.role === 'buyer' && currentPath === '/login') {
      console.log('Redirecting buyer to home');
      router.push('/');
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      console.log('Logging out...');
      
      // Call the logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
  
      setUser(null);
      authChecked.current = false;
    
      router.push('/');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout');
      return { success: false, error: 'Failed to logout' };
    } finally {
      setLoading(false);
    }
  };

 
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext; 