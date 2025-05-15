import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price must be a positive value']
  },
  images: {
    type: [String],
    required: [true, 'Please provide at least one product image'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  category: {
    type: String,
    required: [true, 'Please select a category']
  },
  subcategory: {
    type: String,
    required: [true, 'Please select a subcategory']
  },
  sizes: {
    type: [String],
    default: []
  },
  colors: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    min: [0, 'Stock cannot be negative'],
    default: 1
  },
  status: {
  type: String,
  enum: ['pending', 'approved', 'rejected'],
  default: 'pending',
},
  inventory: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better performance
ProductSchema.index({ sellerId: 1 });
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });

// Use existing model or create a new one
export default mongoose.models.Product || mongoose.model('Product', ProductSchema); 