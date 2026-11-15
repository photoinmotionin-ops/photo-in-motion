import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function EnquiryForm({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New loading state

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    eventType: '', eventDate: '', location: '',
    services: [], budget: '', requirements: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        services: checked
          ? [...prev.services, value]
          : prev.services.filter(s => s !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- UPDATED SUBMIT FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send data to our Vercel Serverless Function (/api/enquiry)
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // Read the response data to see what Vercel is saying
      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
          setTimeout(() => { setIsSubmitted(false); setStep(1); }, 500);
        }, 3000);
      } else {
        // Show the EXACT error message on the screen
        alert(`Backend Error: ${data.message || JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000 }}
          />
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, pointerEvents: 'none', padding: '20px' }}>
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{ pointerEvents: 'auto', background: '#111', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '600px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', overflow: 'hidden' }}
            >
              <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#aaa39a', cursor: 'pointer', zIndex: 10 }}>
                <X size={24} />
              </button>

              {isSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
                  <CheckCircle2 size={60} color="var(--gold)" style={{ margin: '0 auto 20px' }} />
                  <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '36px', color: 'var(--white)', margin: '0 0 10px' }}>Enquiry Received</h3>
                  <p style={{ color: 'var(--muted)' }}>Thank you! We will review your details and get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <>
                  <div style={{ marginBottom: '30px' }}>
                    <p className="eyebrow" style={{ marginBottom: '10px' }}>BOOKING ENQUIRY</p>
                    <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '32px', color: 'var(--white)', margin: 0 }}>Let's Capture Your Story</h3>
                    <div style={{ display: 'flex', gap: '5px', marginTop: '20px' }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{ height: '4px', flex: 1, background: step >= i ? 'var(--gold)' : 'rgba(255,255,255,0.1)', borderRadius: '2px', transition: 'all 0.3s' }} />
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    {/* STEP 1: Personal Details */}
                    {step === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ color: 'var(--gold)', marginBottom: '15px', fontSize: '14px', letterSpacing: '1px' }}>1. YOUR DETAILS</h4>
                        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={inputStyle} />
                        <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required style={inputStyle} />
                      </motion.div>
                    )}

                    {/* STEP 2: Event Details */}
                    {step === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ color: 'var(--gold)', marginBottom: '15px', fontSize: '14px', letterSpacing: '1px' }}>2. EVENT DETAILS</h4>
                        <select name="eventType" value={formData.eventType} onChange={handleChange} required style={inputStyle}>
                          <option value="">Select Event Type</option>
                          <option value="wedding">Wedding</option>
                          <option value="pre-wedding">Pre-Wedding Shoot</option>
                          <option value="engagement">Engagement</option>
                          <option value="birthday">Birthday / Celebration</option>
                          <option value="corporate">Corporate Event</option>
                        </select>
                        <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required style={inputStyle} />
                        <input type="text" name="location" placeholder="Event Location / City" value={formData.location} onChange={handleChange} required style={inputStyle} />
                      </motion.div>
                    )}

                    {/* STEP 3: Requirements */}
                    {step === 3 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ color: 'var(--gold)', marginBottom: '15px', fontSize: '14px', letterSpacing: '1px' }}>3. REQUIREMENTS</h4>
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                          <label style={checkboxStyle}><input type="checkbox" name="services" value="photography" onChange={handleChange} /> Photography</label>
                          <label style={checkboxStyle}><input type="checkbox" name="services" value="cinematography" onChange={handleChange} /> Cinematography</label>
                        </div>
                        <select name="budget" value={formData.budget} onChange={handleChange} required style={inputStyle}>
                          <option value="">Select Budget Range</option>
                          <option value="under-50k">Under ₹50,000</option>
                          <option value="50k-1l">₹50,000 - ₹1,00,000</option>
                          <option value="1l-3l">₹1,00,000 - ₹3,00,000</option>
                          <option value="above-3l">Above ₹3,00,000</option>
                        </select>
                        <textarea name="requirements" placeholder="Any specific requirements?" value={formData.requirements} onChange={handleChange} rows="3" style={inputStyle} />
                      </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                      {step > 1 ? (
                        <button type="button" onClick={() => setStep(step - 1)} disabled={isSubmitting} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                          <ArrowLeft size={16} /> Back
                        </button>
                      ) : <div />}

                      {step < 3 ? (
                        <button type="button" onClick={() => setStep(step + 1)} className="primary-btn" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          Next Step <ArrowRight size={16} />
                        </button>
                      ) : (
                        <button type="submit" className="primary-btn" disabled={isSubmitting} style={{ padding: '12px 24px', opacity: isSubmitting ? 0.7 : 1 }}>
                          {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                        </button>
                      )}
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Reusable inline styles for form inputs
const inputStyle = {
  width: '100%', padding: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--white)', fontSize: '14px', marginBottom: '15px', outline: 'none', fontFamily: 'var(--body-font)'
};

const checkboxStyle = {
  display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)', fontSize: '14px', cursor: 'pointer'
};