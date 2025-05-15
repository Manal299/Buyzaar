import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { role, status } = req.body;

    await connectToDatabase();

    const update = {};
    if (role) update.role = role;
    if (status) update.status = status;

    const user = await User.findByIdAndUpdate(id, update, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
