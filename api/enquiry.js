import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, eventType, eventDate, location, budget, requirements } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required.' });
  }

  // 2. Connect to MongoDB using the Environment Variable you will set in Vercel
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    
    // 3. Select the database and collection
    const db = client.db('photoinmotion'); 
    const collection = db.collection('enquiries');

    // 4. Insert the data
    const result = await collection.insertOne({
      name,
      email,
      phone,
      eventType,
      eventDate,
      location,
      budget,
      requirements,
      status: 'unread',
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Enquiry saved successfully', id: result.insertedId });
  } catch (error) {
    console.error('MongoDB Error:', error);
    res.status(500).json({ message: 'Error saving enquiry' });
  } finally {
    await client.close();
  }
}