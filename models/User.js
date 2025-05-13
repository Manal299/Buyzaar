import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Don't return password in queries by default
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer'
  },
  status: {
    type: String,
    enum: ['active', 'banned', 'pending'],
    default: function() {
      // Set pending status only for sellers, active for others
      return this.role === 'seller' ? 'pending' : 'active';
    }
  },
  isOnboarded: {
    type: Boolean,
    default: false
  },
  profileImage: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  // Only run this if password was modified
  if (!this.isModified('password')) {
    return next();
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if password matches
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual to populate seller data
UserSchema.virtual('sellerInfo', {
  ref: 'Seller',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 