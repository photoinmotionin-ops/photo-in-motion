import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('photoinmotion');
    const collection = db.collection('enquiries');

    if (req.method === 'POST') {
      const { name, email, phone, eventType, eventDate, location, budget, requirements } = req.body;
      
      await collection.insertOne({
        name, email, phone, eventType, eventDate, location, budget, requirements,
        status: 'unread', 
        createdAt: new Date()
      });

      return res.status(201).json({ message: 'Enquiry saved successfully' });
    }

    if (req.method === 'GET') {
      // CRITICAL: You must use .toArray() otherwise React cannot map over it
      const enquiries = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(enquiries);
    }

  } catch (error) {
    console.error("MongoDB Error:", error);
    return res.status(500).json({ message: 'Database error' });
  } finally {
    await client.close();
  }
}