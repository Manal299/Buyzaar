import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';
import Seller from '../../../models/Seller';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();
          
          
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user) {
            throw new Error('No user found with this email');
          }
          
         
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }
          
          
          let sellerData = null;
          if (user.role === 'seller') {
            sellerData = await Seller.findOne({ userId: user._id });
          }
          
        
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            isOnboarded: user.isOnboarded || false,
            sellerInfo: sellerData || null,
            image: user.profileImage || null,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
     
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.isOnboarded = user.isOnboarded;
        token.sellerInfo = user.sellerInfo;
      }
      return token;
    },
    async session({ session, token }) {
      
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.isOnboarded = token.isOnboarded;
        session.user.sellerInfo = token.sellerInfo;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login', 
    newUser: '/seller/onboarding' 
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-should-be-in-env-for-production',
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions); 