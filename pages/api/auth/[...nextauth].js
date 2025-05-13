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
          
          // Find user by email
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user) {
            throw new Error('No user found with this email');
          }
          
          // Check password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }
          
          // If user is a seller, get seller data
          let sellerData = null;
          if (user.role === 'seller') {
            sellerData = await Seller.findOne({ userId: user._id });
          }
          
          // Return user without password
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
      // Add user data to token when signing in
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
      // Add custom user data to session
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
    error: '/login', // Error code passed in query string as ?error=
    newUser: '/seller/onboarding' // New users will be directed here on first sign in
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-should-be-in-env-for-production',
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions); 