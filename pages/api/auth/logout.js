export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0');
  return res.status(200).json({ message: 'Logged out successfully' });
}