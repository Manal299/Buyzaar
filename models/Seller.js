import mongoose from 'mongoose';

const BankInfoSchema = new mongoose.Schema({
  bankName: String,
  accountNumber: String,
  routingNumber: String,
}, { _id: false });

const SellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  storeName: {
    type: String,
    required: [true, 'Please provide a store name'],
    trim: true
  },
  storeDescription: {
    type: String,
    trim: true
  },
  storeAddress: {
    type: String,
    required: [true, 'Please provide a store address']
  },
  storePhone: String,
  storeWebsite: String,
  storeLogo: String,
  businessType: {
    type: String,
    enum: ['individual', 'partnership', 'llc', 'corporation', 'nonprofit'],
    required: [true, 'Please specify business type']
  },
  taxId: String,
  establishedYear: Number,
  categories: [String],
  bankInfo: BankInfoSchema,
  isOnboarded: {
    type: Boolean,
    default: true
  },
  onboardedAt: {
    type: Date,
    default: Date.now
  },
  storeRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  totalProducts: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// Create indexes for better performance
SellerSchema.index({ userId: 1 });
SellerSchema.index({ storeName: 'text', storeDescription: 'text' });
SellerSchema.index({ categories: 1 });

export default mongoose.models.Seller || mongoose.model('Seller', SellerSchema); 