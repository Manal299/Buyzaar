import { connectToDatabase } from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    await connectToDatabase();

    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, passwordHash: hashed, role });

    return res.status(201).json({ message: 'User created', user: { id: newUser._id, email: newUser.email, role: newUser.role } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}