import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { password } = req.body;

  // Check the password against the Environment Variable in Vercel
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  // Create a secure token that lasts for 24 hours
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });

  res.status(200).json({ token });
}