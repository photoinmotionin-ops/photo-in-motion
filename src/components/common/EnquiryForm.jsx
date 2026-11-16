import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

// --- CONFIGURATION ---
const uri = process.env.MONGODB_URI;
const DB_NAME = 'photoinmotion';
const ENQUIRIES_COLLECTION = 'enquiries';
const USERS_COLLECTION = 'users';

// Email Transporter Setup (Use your Gmail and App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com', // REPLACE THIS with your actual Gmail
    pass: 'your_app_password'     // REPLACE THIS with your App Password
  }
});

export default async function handler(req, res) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const enquiriesCol = db.collection(ENQUIRIES_COLLECTION);
    const usersCol = db.collection(USERS_COLLECTION);

    // 1. ENQUIRY FORM SUBMISSION (POST)
    if (req.method === 'POST' && req.body.action === 'submit_enquiry') {
      const { name, email, phone, eventType, eventDate, location, budget, requirements } = req.body;
      await enquiriesCol.insertOne({
        name, email, phone, eventType, eventDate, location, budget, requirements,
        status: 'unread', createdAt: new Date()
      });
      return res.status(201).json({ message: 'Enquiry saved successfully' });
    }

    // 2. ADMIN LOGIN (POST)
    if (req.method === 'POST' && req.body.action === 'login') {
      const { username, password } = req.body;
      const user = await usersCol.findOne({ username });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      return res.status(200).json({ message: 'Login successful', username: user.username });
    }

    // 3. REQUEST OTP FOR PASSWORD RESET (POST)
    if (req.method === 'POST' && req.body.action === 'request_otp') {
      const { username } = req.body;
      const user = await usersCol.findOne({ username });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      await usersCol.updateOne({ username }, { $set: { otp, otpExpires } });

      const mailOptions = {
        from: 'your_email@gmail.com', // REPLACE THIS
        to: user.email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`
      };

      try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'OTP sent to email' });
      } catch (emailError) {
        return res.status(500).json({ message: 'Failed to send OTP email.' });
      }
    }

    // 4. RESET PASSWORD WITH OTP (POST)
    if (req.method === 'POST' && req.body.action === 'reset_password') {
      const { username, otp, newPassword } = req.body;
      const user = await usersCol.findOne({ username });

      if (!user || user.otp !== otp || new Date() > new Date(user.otpExpires)) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      await usersCol.updateOne(
        { username }, 
        { $set: { password: newPassword }, $unset: { otp: "", otpExpires: "" } }
      );
      return res.status(200).json({ message: 'Password reset successfully' });
    }

    // 5. SAVE SITE CONTENT (POST)
    if (req.method === 'POST' && req.body.action === 'save_content') {
      const { content } = req.body;
      await db.collection('site_content').updateOne(
        { _id: 'main_site' },
        { $set: content },
        { upsert: true }
      );
      return res.status(200).json({ message: 'Content saved successfully' });
    }

    // 6. FETCH ENQUIRIES FOR DASHBOARD (GET)
    if (req.method === 'GET' && req.query.action === 'get_enquiries') {
      const enquiries = await enquiriesCol.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(enquiries);
    }

    // 7. FETCH SITE CONTENT (GET)
    if (req.method === 'GET' && req.query.action === 'get_content') {
      const content = await db.collection('site_content').findOne({ _id: 'main_site' });
      return res.status(200).json(content || {});
    }

    return res.status(400).json({ message: 'Invalid action' });

  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: 'Database error' });
  } finally {
    await client.close();
  }
}