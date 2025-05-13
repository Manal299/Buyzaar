import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';
import Seller from '../../../models/Seller';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  // Make sure response is set as JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get session
    const session = await getServerSession(req, res, authOptions);
    
    // Debug the session
    console.log('Onboarding API - Session data:', JSON.stringify({
      authenticated: !!session,
      userId: session?.user?.id,
      role: session?.user?.role
    }));
    
    // Check if user is authenticated
    if (!session) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    
    // Check if user is a seller
    if (session.user.role !== 'seller' && session.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized. Only sellers can access this endpoint.' });
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Find user in database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Extract store information from request body
    const {
      storeName,
      storeDescription,
      storeAddress,
      storeCity,
      storeState,
      storeZip,
      storeCountry,
      storePhone,
      storeWebsite,
      businessType,
      taxId,
      establishedYear,
      categories,
      bankName,
      accountNumber,
      routingNumber
    } = req.body;
    
    // Required fields validation
    if (!storeName || !storeAddress || !businessType) {
      return res.status(400).json({ success: false, error: 'Required fields missing' });
    }
    
    // Create full address string
    const fullAddress = [
      storeAddress,
      storeCity,
      storeState,
      storeZip,
      storeCountry
    ].filter(Boolean).join(', ');
    
    // Check if seller record already exists for this user
    let seller = await Seller.findOne({ userId: user._id });
    
    if (seller) {
      // Update existing seller record
      seller.storeName = storeName;
      seller.storeDescription = storeDescription;
      seller.storeAddress = fullAddress;
      seller.storePhone = storePhone;
      seller.storeWebsite = storeWebsite;
      seller.businessType = businessType;
      seller.taxId = taxId;
      seller.establishedYear = establishedYear;
      seller.categories = categories;
      seller.bankInfo = {
        bankName,
        accountNumber,
        routingNumber
      };
      seller.isOnboarded = true;
      seller.onboardedAt = new Date();
    } else {
      // Create new seller record
      seller = new Seller({
        userId: user._id,
        storeName,
        storeDescription,
        storeAddress: fullAddress,
        storePhone,
        storeWebsite,
        businessType,
        taxId,
        establishedYear,
        categories,
        bankInfo: {
          bankName,
          accountNumber,
          routingNumber
        },
        isOnboarded: true,
        onboardedAt: new Date()
      });
    }
    
    try {
      // Save seller record and update user
      await seller.save();
      
      // Update user's onboarding status and change status from pending to active
      user.isOnboarded = true;
      user.status = 'active'; // Change status from pending to active after onboarding
      await user.save();
      
      console.log(`Seller onboarding completed for user ${user._id} (${user.email})`);
      
      // Return success
      return res.status(200).json({
        success: true,
        message: 'Seller information saved successfully'
      });
    } catch (saveError) {
      console.error('Error saving seller data:', saveError);
      return res.status(500).json({
        success: false,
        error: 'Database error while saving seller data: ' + saveError.message
      });
    }
    
  } catch (error) {
    console.error('Seller onboarding error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save seller information: ' + error.message
    });
  }
} 