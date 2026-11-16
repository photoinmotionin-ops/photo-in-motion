// @ts-nocheck
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

// ==========================================
// REPLACE THESE WITH YOUR ACTUAL GMAIL DETAILS
// ==========================================
const MY_EMAIL = 'photoinmotion.in@gmail.com'; 
const MY_APP_PASSWORD = 'foizvbxjkidfmoet'; 
// ==========================================

const uri = process.env.MONGODB_URI;
const DB_NAME = 'photoinmotion';

export default async function handler(req, res) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const enquiriesCol = db.collection('enquiries');
    const usersCol = db.collection('users');

    // 1. ENQUIRY FORM SUBMISSION
    if (req.method === 'POST' && req.body.action === 'submit_enquiry') {
      const { name, email, phone, eventType, eventDate, location, budget, requirements } = req.body;
      await enquiriesCol.insertOne({
        name, email, phone, eventType, eventDate, location, budget, requirements,
        status: 'unread', createdAt: new Date()
      });
      return res.status(201).json({ message: 'Enquiry saved successfully' });
    }

    // 2. ADMIN LOGIN
    if (req.method === 'POST' && req.body.action === 'login') {
      const { username, password } = req.body;
      const user = await usersCol.findOne({ username });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      return res.status(200).json({ message: 'Login successful', username: user.username });
    }

    // 3. REQUEST OTP (Fetches email dynamically from MongoDB)
    if (req.method === 'POST' && req.body.action === 'request_otp') {
      const { username } = req.body;
      
      // Look up the user in MongoDB
      const user = await usersCol.findOne({ username });
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      
      // Save OTP to the user's document
      await usersCol.updateOne({ username }, { $set: { otp, otpExpires } });

      // Configure Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: MY_EMAIL,
          pass: MY_APP_PASSWORD
        }
      });

      // Send email to the address saved in MongoDB
      const mailOptions = {
        from: MY_EMAIL,
        to: user.email, // <--- THIS IS THE DYNAMIC EMAIL FROM MONGODB
        subject: 'Photo In Motion - Password Reset OTP',
        text: `Hello ${user.username},\n\nYour OTP for password reset is: ${otp}\n\nThis code expires in 10 minutes.`
      };

      try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'OTP sent to your registered email' });
      } catch (emailError) {
        console.error("Email Error:", emailError);
        return res.status(500).json({ message: 'Failed to send OTP email. Check Gmail credentials.' });
      }
    }

    // 4. RESET PASSWORD WITH OTP
    if (req.method === 'POST' && req.body.action === 'reset_password') {
      const { username, otp, newPassword } = req.body;
      const user = await usersCol.findOne({ username });

      if (!user || user.otp !== otp || new Date() > new Date(user.otpExpires)) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      // Update password and clear OTP
      await usersCol.updateOne(
        { username }, 
        { $set: { password: newPassword }, $unset: { otp: "", otpExpires: "" } }
      );
      return res.status(200).json({ message: 'Password reset successfully' });
    }

    // 5. SAVE SITE CONTENT
    if (req.method === 'POST' && req.body.action === 'save_content') {
      const { content } = req.body;
      await db.collection('site_content').updateOne(
        { _id: 'main_site' },
        { $set: content },
        { upsert: true }
      );
      return res.status(200).json({ message: 'Content saved successfully' });
    }

    // 6. FETCH ENQUIRIES FOR DASHBOARD
    if (req.method === 'GET' && req.query.action === 'get_enquiries') {
      const enquiries = await enquiriesCol.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(enquiries);
    }

    // 7. FETCH SITE CONTENT
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