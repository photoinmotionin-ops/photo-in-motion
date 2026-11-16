import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://photoinmotionin_db_user:YOUR_MONGODB_PASSWORD@cluster0.mya1eq.mongodb.net/photoinmotion?retryWrites=true&w=majority";

export default async function handler(req, res) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('photoinmotion');
    const collection = db.collection('enquiries');

    // 1. If the form submits data (POST)
    if (req.method === 'POST') {
      const { name, email, phone, eventType, eventDate, location, budget, requirements } = req.body;
      
      await collection.insertOne({
        name, email, phone, eventType, eventDate, location, budget, requirements,
        status: 'unread', 
        createdAt: new Date()
      });

      return res.status(201).json({ message: 'Enquiry saved successfully' });
    }

    // 2. If the dashboard requests data (GET)
    if (req.method === 'GET') {
      const enquiries = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(enquiries);
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Database error' });
  } finally {
    await client.close();
  }
}