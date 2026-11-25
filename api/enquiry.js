import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

// ==========================================
// CONFIGURATION (Allow large image uploads)
// ==========================================
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// ==========================================
// REPLACE THESE WITH YOUR ACTUAL GMAIL DETAILS
// ==========================================
const MY_EMAIL = 'photoinmotion.in@gmail.com'; 
const MY_APP_PASSWORD = 'foizvbxjkidfmoet'; 
// ==========================================

const uri = process.env.MONGODB_URI;
const DB_NAME = 'photoinmotion';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  const client = await connectToDatabase();
  
  try {
    const db = client.db(DB_NAME);
    const enquiriesCol = db.collection('enquiries');
    const usersCol = db.collection('users');

    // ==========================================
    // 1. ENQUIRY FORM SUBMISSION (WITH EMAILS)
    // ==========================================
    if (req.method === 'POST' && req.body.action === 'submit_enquiry') {
      const { name, email, phone, eventType, eventDate, location, budget, requirements, otherDescription } = req.body;
      
      // 1a. Save to Database
      await enquiriesCol.insertOne({
        name, email, phone, eventType, eventDate, location, budget, requirements, otherDescription,
        status: 'unread', createdAt: new Date()
      });

      // 1b. Setup Email Transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: MY_EMAIL,
          pass: MY_APP_PASSWORD
        }
      });

      // 1c. Send Email to Admin
      const adminMailOptions = {
        from: MY_EMAIL,
        to: MY_EMAIL,
        subject: `New Enquiry: ${name} - ${eventType}`,
        text: `You have received a new booking enquiry!\n\nClient Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nEvent Type: ${eventType}\nEvent Date: ${eventDate}\nLocation: ${location}\nBudget: ${budget}\nOther Details: ${otherDescription || requirements || 'None'}`
      };

      // 1d. Send Confirmation Email to User
      const userMailOptions = {
        from: MY_EMAIL,
        to: email,
        subject: `Thank you for your enquiry - Photo In Motion`,
        text: `Hello ${name},\n\nThank you for reaching out to Photo In Motion! We have received your enquiry for your ${eventType} on ${eventDate}.\n\nWe will review your details and get back to you shortly.\n\nBest regards,\nPhoto In Motion Team`
      };

      try {
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);
      } catch (emailError) {
        console.error("Email failed to send:", emailError);
        // We don't block the success response if email fails, but we log the error
      }

      return res.status(201).json({ message: 'Enquiry saved successfully' });
    }

    // ==========================================
    // 2. ADMIN LOGIN
    // ==========================================
    if (req.method === 'POST' && req.body.action === 'login') {
      const { username, password } = req.body;
      const user = await usersCol.findOne({ username });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      return res.status(200).json({ message: 'Login successful', username: user.username });
    }

    // ==========================================
    // 3. REQUEST OTP (Fetches email dynamically)
    // ==========================================
    if (req.method === 'POST' && req.body.action === 'request_otp') {
      const { username } = req.body;
      
      const user = await usersCol.findOne({ username });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      
      await usersCol.updateOne({ username }, { $set: { otp, otpExpires } });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: MY_EMAIL,
          pass: MY_APP_PASSWORD
        }
      });

      const mailOptions = {
        from: MY_EMAIL,
        to: user.email, 
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

    // ==========================================
    // 4. RESET PASSWORD WITH OTP
    // ==========================================
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

    // ==========================================
    // 5. SAVE SITE CONTENT
    // ==========================================
    if (req.method === 'POST' && req.body.action === 'save_content') {
      const { content } = req.body;
      await db.collection('site_content').updateOne(
        { _id: 'main_site' },
        { $set: content },
        { upsert: true }
      );
      return res.status(200).json({ message: 'Content saved successfully' });
    }

    // ==========================================
    // 6. FETCH ENQUIRIES FOR DASHBOARD
    // ==========================================
    if (req.method === 'GET' && req.query.action === 'get_enquiries') {
      const enquiries = await enquiriesCol.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(enquiries);
    }

    // ==========================================
    // 7. FETCH SITE CONTENT
    // ==========================================
    if (req.method === 'GET' && req.query.action === 'get_content') {
      const content = await db.collection('site_content').findOne({ _id: 'main_site' });
      return res.status(200).json(content || {});
    }

    return res.status(400).json({ message: 'Invalid action' });

  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message: 'Database error' });
  }
}