import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

export default function EnquiryForm({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultEventTypes = ['Wedding', 'Baby Shower', 'Post Wedding', 'Car Delivery', 'Others'];
  const [eventTypes, setEventTypes] = useState(defaultEventTypes);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    eventType: '', eventDate: '', location: '',
    services: [], budget: '', otherDescription: ''
  });

  // Fetch dynamic event types
  useEffect(() => {
    if (isOpen) {
      fetch('/api/enquiry?action=get_content')
        .then(res => res.json())
        .then(data => {
          if (data.eventTypes && data.eventTypes.length > 0) {
            setEventTypes(data.eventTypes);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'submit_enquiry', 
          ...formData 
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
          setTimeout(() => { 
            setIsSubmitted(false); 
            setStep(1); 
            setFormData({ name: '', email: '', phone: '', eventType: '', eventDate: '', location: '', services: [], budget: '', otherDescription: '' });
          }, 500);
        }, 4000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Something went wrong.'}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting form. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.name && formData.email && formData.phone;
    }
    if (step === 2) {
      if (formData.eventType === 'Others' && !formData.otherDescription) return false;
      return formData.eventType && formData.eventDate && formData.location;
    }
    return true;
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
              <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#aaa39a', cursor: 'pointer', zIndex: 10 }} disabled={isSubmitting}>
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
                    
                    {/* STEP 1: MANDATORY DETAILS */}
                    {step === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ color: 'var(--gold)', marginBottom: '15px', fontSize: '14px', letterSpacing: '1px' }}>1. YOUR DETAILS</h4>
                        <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleChange} required style={getInputStyle(isSubmitting)} disabled={isSubmitting} />
                        <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} required style={getInputStyle(isSubmitting)} disabled={isSubmitting} />
                        <input type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleChange} required style={getInputStyle(isSubmitting)} disabled={isSubmitting} />
                      </motion.div>
                    )}

                    {/* STEP 2: EVENT DETAILS */}
                    {step === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ color: 'var(--gold)', marginBottom: '15px', fontSize: '14px', letterSpacing: '1px' }}>2. EVENT DETAILS</h4>
                        
                        <select name="eventType" value={formData.eventType} onChange={handleChange} required style={getInputStyle(isSubmitting)} disabled={isSubmitting}>
                          <option value="">Select Event Type *</option>
                          {eventTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>

                        {/* Conditional Description Field for "Others" */}
                        {formData.eventType === 'Others' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <textarea 
                              name="otherDescription" 
                              placeholder="Please describe your event type *" 
                              value={formData.otherDescription} 
                              onChange={handleChange} 
                              required 
                              style={{ ...getInputStyle(isSubmitting), height: '80px' }} 
                              disabled={isSubmitting} 
                            />
                          </motion.div>
                        )}

                        <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required style={getInputStyle(isSubmitting)} disabled={isSubmitting} />
                        <input type="text" name="location" placeholder="Event Location / City *" value={formData.location} onChange={handleChange} required style={getInputStyle(isSubmitting)} disabled={isSubmitting} />
                      </motion.div>
                    )}

                    {/* STEP 3: BUDGET (Removed Requirements) */}
                    {step === 3 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ color: 'var(--gold)', marginBottom: '15px', fontSize: '14px', letterSpacing: '1px' }}>3. BUDGET</h4>
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                          <label style={checkboxStyle}><input type="checkbox" name="services" value="photography" onChange={handleChange} disabled={isSubmitting} /> Photography</label>
                          <label style={checkboxStyle}><input type="checkbox" name="services" value="cinematography" onChange={handleChange} disabled={isSubmitting} /> Cinematography</label>
                        </div>
                        <select name="budget" value={formData.budget} onChange={handleChange} required style={getInputStyle(isSubmitting)} disabled={isSubmitting}>
                          <option value="">Select Budget Range *</option>
                          <option value="under-50k">Under ₹50,000</option>
                          <option value="50k-1l">₹50,000 - ₹1,00,000</option>
                          <option value="1l-3l">₹1,00,000 - ₹3,00,000</option>
                          <option value="above-3l">Above ₹3,00,000</option>
                        </select>
                      </motion.div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center' }}>
                      {step > 1 ? (
                        <button type="button" onClick={() => setStep(step - 1)} disabled={isSubmitting} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                          <ArrowLeft size={16} /> Back
                        </button>
                      ) : <div />}
                      
                      {step < 3 ? (
                        <button type="button" onClick={() => setStep(step + 1)} disabled={!isStepValid() || isSubmitting} className="primary-btn" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', opacity: !isStepValid() || isSubmitting ? 0.5 : 1 }}>
                          Next Step <ArrowRight size={16} />
                        </button>
                      ) : (
                        <button type="submit" disabled={isSubmitting} className="primary-btn" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', opacity: isSubmitting ? 0.7 : 1 }}>
                          {isSubmitting ? (
                            <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</>
                          ) : 'Submit Enquiry'}
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

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

const getInputStyle = (isSubmitting) => ({
  width: '100%', padding: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--white)', fontSize: '14px', marginBottom: '15px', outline: 'none', fontFamily: 'var(--body-font)',
  opacity: isSubmitting ? 0.5 : 1
});

const checkboxStyle = {
  display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)', fontSize: '14px', cursor: 'pointer'
};