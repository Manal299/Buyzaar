import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  await connectToDatabase();

  const users = await User.find({}, 'name email role status createdAt').sort({ createdAt: -1 }).lean();

  return res.status(200).json({ success: true, users });
}
