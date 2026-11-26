// import { MongoClient } from 'mongodb';
import { MongoClient, ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

const MY_EMAIL = 'photoinmotion.in@gmail.com'; 
const MY_APP_PASSWORD = 'foizvbxjkidfmoet'; 

const uri = process.env.MONGODB_URI;
const DB_NAME = 'photoinmotion';

let cachedClient = null;
async function connectToDatabase() {
  if (cachedClient) return cachedClient;
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


// DELETE ENQUIRY FROM MONGODB
if (req.method === 'POST' && req.body.action === 'delete_enquiry') {
  const { id } = req.body;

  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid enquiry ID'
    });
  }

  const result = await enquiriesCol.deleteOne({
    _id: new ObjectId(id)
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({
      message: 'Enquiry not found'
    });
  }

  return res.status(200).json({
    message: 'Enquiry deleted successfully'
  });
}


    if (req.method === 'POST' && req.body.action === 'submit_enquiry') {
      const { name, email, phone, eventType, eventDate, location, budget, requirements, otherDescription } = req.body;
      
      await enquiriesCol.insertOne({
        name, email, phone, eventType, eventDate, location, budget, requirements, otherDescription,
        status: 'unread', createdAt: new Date()
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: MY_EMAIL, pass: MY_APP_PASSWORD }
      });

      // 1. ADMIN EMAIL (Professional HTML Format)
      const adminMailOptions = {
        from: `"Photo In Motion" <${MY_EMAIL}>`,
        to: MY_EMAIL,
        replyTo: email, 
        subject: `New Booking Enquiry: ${name} - ${eventType}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; padding: 20px; border-radius: 10px;">
            <h2 style="color: #c6a46b; border-bottom: 1px solid #333; padding-bottom: 10px;">New Client Enquiry</h2>
            <p style="font-size: 16px;"><strong>Name:</strong> ${name}</p>
            <p style="font-size: 16px;"><strong>Phone:</strong> ${phone}</p>
            <p style="font-size: 16px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #c6a46b;">${email}</a></p>
            <p style="font-size: 16px;"><strong>Event Type:</strong> ${eventType}</p>
            <p style="font-size: 16px;"><strong>Event Date:</strong> ${eventDate}</p>
            <p style="font-size: 16px;"><strong>Location:</strong> ${location}</p>
            <p style="font-size: 16px;"><strong>Budget:</strong> ${budget}</p>
            <div style="background: #1a1a1a; padding: 15px; border-left: 4px solid #c6a46b; margin-top: 20px;">
              <p style="margin: 0; font-style: italic; color: #aaa;">"${otherDescription || requirements || 'No additional details.'}"</p>
            </div>
          </div>
        `
      };

      // 2. USER EMAIL (Beautiful Confirmation)
      const userMailOptions = {
        from: `"Photo In Motion" <${MY_EMAIL}>`,
        to: email,
        subject: `Thank you for your enquiry - Photo In Motion`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 10px; text-align: center; border: 1px solid #333;">
            <h1 style="color: #c6a46b; font-size: 28px; margin-bottom: 10px;">Photo In Motion</h1>
            <h2 style="color: #fff; font-size: 22px;">Hello ${name},</h2>
            <p style="color: #aaa; font-size: 16px; line-height: 1.6;">Thank you for reaching out to us! We have successfully received your enquiry for your <strong>${eventType}</strong> on <strong>${eventDate}</strong>.</p>
            <p style="color: #aaa; font-size: 16px; line-height: 1.6;">Our team is reviewing your details and will get back to you shortly to discuss the next steps.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
              <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Photo In Motion. All rights reserved.</p>
            </div>
          </div>
        `
      };

      try {
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);
      } catch (emailError) {
        console.error("Email failed to send:", emailError);
      }

      return res.status(201).json({ message: 'Enquiry saved successfully' });
    }

    // Keep the rest of your API code exactly the same...
    if (req.method === 'POST' && req.body.action === 'login') {
      const { username, password } = req.body;
      const user = await usersCol.findOne({ username });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      return res.status(200).json({ message: 'Login successful', username: user.username });
    }

    if (req.method === 'POST' && req.body.action === 'request_otp') {
      const { username } = req.body;
      const user = await usersCol.findOne({ username });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await usersCol.updateOne({ username }, { $set: { otp, otpExpires } });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: MY_EMAIL, pass: MY_APP_PASSWORD }
      });

      const mailOptions = {
        from: `"Photo In Motion" <${MY_EMAIL}>`,
        to: user.email, 
        subject: 'Photo In Motion - Password Reset OTP',
        text: `Hello ${user.username},\n\nYour OTP for password reset is: ${otp}\n\nThis code expires in 10 minutes.`
      };

      try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'OTP sent to your registered email' });
      } catch (emailError) {
        return res.status(500).json({ message: 'Failed to send OTP email. Check Gmail credentials.' });
      }
    }

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

    if (req.method === 'POST' && req.body.action === 'save_content') {
      const { content } = req.body;
      await db.collection('site_content').updateOne(
        { _id: 'main_site' },
        { $set: content },
        { upsert: true }
      );
      return res.status(200).json({ message: 'Content saved successfully' });
    }

    if (req.method === 'GET' && req.query.action === 'get_enquiries') {
      const enquiries = await enquiriesCol.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(enquiries);
    }

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