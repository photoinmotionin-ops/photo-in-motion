import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

const defaultEventTypes = ['Wedding', 'Baby Shower', 'Post Wedding', 'Car Delivery', 'Others'];
const defaultBudgetRanges = ['Under ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹3,00,000', 'Above ₹3,00,000'];
const defaultServices = ['Photography', 'Cinematography', 'Drone / Aerial Coverage', 'Luxury Album Printing'];

export default function EnquiryForm({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dynamic Admin Configs
  const [eventTypes, setEventTypes] = useState(defaultEventTypes);
  const [budgetRanges, setBudgetRanges] = useState(defaultBudgetRanges);
  const [availableServices, setAvailableServices] = useState(defaultServices);
  const [successTitle, setSuccessTitle] = useState('Enquiry Received');
  const [successDesc, setSuccessDesc] = useState('Thank you! We will review your details and get back to you within 24 hours.');

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    eventType: '', eventDate: '', location: '',
    services: [], budget: '', otherDescription: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetch('/api/enquiry?action=get_content')
        .then(res => res.json())
        .then(data => {
          if (data) {
            // Event types with 'Others' sorted last
            if (data.eventTypes && data.eventTypes.length > 0) {
              const sortedTypes = [...data.eventTypes].sort((a, b) => {
                if (a === 'Others') return 1;
                if (b === 'Others') return -1;
                return 0;
              });
              setEventTypes(sortedTypes);
            }
            // Dynamic Budget Ranges
            if (data.budgetRanges && data.budgetRanges.length > 0) {
              setBudgetRanges(data.budgetRanges);
            }
            // Dynamic Services
            if (data.enquiryServices && data.enquiryServices.length > 0) {
              setAvailableServices(data.enquiryServices);
            }
            // Success messages
            if (data.enquirySuccessTitle) setSuccessTitle(data.enquirySuccessTitle);
            if (data.enquirySuccessDesc) setSuccessDesc(data.enquirySuccessDesc);
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
        services: checked ? [...prev.services, value] : prev.services.filter(s => s !== value)
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
        body: JSON.stringify({ action: 'submit_enquiry', ...formData })
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
        }, 3500);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Something went wrong.'}`);
      }
    } catch (error) {
      alert("Error submitting form. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.name && formData.email && formData.phone;
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000 }} />
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, pointerEvents: 'none', padding: '20px' }}>
            <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} style={{ pointerEvents: 'auto', background: '#111', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '600px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
              
              <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#aaa39a', cursor: 'pointer', zIndex: 10 }} disabled={isSubmitting}><X size={24} /></button>

              {isSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
                  <CheckCircle2 size={60} color="var(--gold, #c6a46b)" style={{ margin: '0 auto 20px' }} />
                  <h3 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '36px', color: 'var(--white, #fff)', margin: '0 0 10px' }}>{successTitle}</h3>
                  <p style={{ color: 'var(--muted, #aaa)', fontSize: '14px', lineHeight: 1.6 }}>{successDesc}</p>
                </motion.div>
              ) : (
                <>
                  <div style={{ marginBottom: '30px' }}>
                    <p className="eyebrow" style={{ marginBottom: '10px' }}>BOOKING ENQUIRY</p>
                    <h3 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '32px', color: 'var(--white, #fff)', margin: 0 }}>Let's Capture Your Story</h3>
                    <div style={{ display: 'flex', gap: '5px', marginTop: '20px' }}>
                      {[1, 2, 3].map(i => <div key={i} style={{ height: '4px', flex: 1, background: step >= i ? 'var(--gold, #c6a46b)' : 'rgba(255,255,255,0.1)', borderRadius: '2px', transition: 'all 0.3s' }} />)}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {/* STEP 1: PERSONAL DETAILS */}
                    {step === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ color: 'var(--gold, #c6a46b)', marginBottom: '15px', fontSize: '13px', letterSpacing: '1px' }}>1. YOUR DETAILS</h4>
                        <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleChange} required style={getInputStyle(isSubmitting)} disabled={isSubmitting} />
                        <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} required style={getInputStyle(isSubmitting)} disabled={isSubmitting} />
                        <input type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleChange} required style={getInputStyle(isSubmitting)} disabled={isSubmitting} />
                      </motion.div>
                    )}

                    {/* STEP 2: EVENT DETAILS */}
                    {step === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ color: 'var(--gold, #c6a46b)', marginBottom: '15px', fontSize: '13px', letterSpacing: '1px' }}>2. EVENT DETAILS</h4>
                        
                        <div className="custom-select-wrapper" style={{ marginBottom: '15px' }}>
                          <select 
                            name="eventType" 
                            value={formData.eventType} 
                            onChange={handleChange} 
                            required 
                            style={getInputStyle(isSubmitting)} 
                            disabled={isSubmitting}
                            className="custom-select"
                          >
                            <option value="" disabled>Select Event Type *</option>
                            {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
                          </select>
                        </div>

                        {formData.eventType === 'Others' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <textarea name="otherDescription" placeholder="Please describe your event type *" value={formData.otherDescription} onChange={handleChange} required style={{ ...getInputStyle(isSubmitting), height: '80px' }} disabled={isSubmitting} />
                          </motion.div>
                        )}

                        <div style={{ marginBottom: '15px' }}>
                          <input 
                            type="date" 
                            name="eventDate" 
                            value={formData.eventDate} 
                            onChange={handleChange} 
                            required 
                            style={{ ...getInputStyle(isSubmitting), colorScheme: 'dark' }} 
                            disabled={isSubmitting} 
                            className="custom-date-picker"
                          />
                        </div>

                        <input type="text" name="location" placeholder="Event Location / City *" value={formData.location} onChange={handleChange} required style={getInputStyle(isSubmitting)} disabled={isSubmitting} />
                      </motion.div>
                    )}

                    {/* STEP 3: SERVICES & BUDGET */}
                    {step === 3 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ color: 'var(--gold, #c6a46b)', marginBottom: '12px', fontSize: '13px', letterSpacing: '1px' }}>3. SERVICES & BUDGET</h4>
                        
                        {/* Dynamic Services Checkboxes */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '18px' }}>
                          {availableServices.map((service) => (
                            <label key={service} style={checkboxStyle}>
                              <input 
                                type="checkbox" 
                                name="services" 
                                value={service} 
                                checked={formData.services.includes(service)}
                                onChange={handleChange} 
                                disabled={isSubmitting} 
                              /> 
                              <span>{service}</span>
                            </label>
                          ))}
                        </div>
                        
                        {/* Dynamic Budget Dropdown */}
                        <div className="custom-select-wrapper">
                          <select 
                            name="budget" 
                            value={formData.budget} 
                            onChange={handleChange} 
                            required 
                            style={getInputStyle(isSubmitting)} 
                            disabled={isSubmitting}
                            className="custom-select"
                          >
                            <option value="" disabled>Select Budget Range *</option>
                            {budgetRanges.map((range) => (
                              <option key={range} value={range}>{range}</option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center' }}>
                      {step > 1 ? (
                        <button type="button" onClick={() => setStep(step - 1)} disabled={isSubmitting} style={{ background: 'transparent', border: 'none', color: 'var(--muted, #aaa)', display: 'flex', alignItems: 'center', gap: '5px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
                          <ArrowLeft size={16} /> Back
                        </button>
                      ) : <div />}
                      
                      {step < 3 ? (
                        <button type="button" onClick={() => setStep(step + 1)} disabled={!isStepValid() || isSubmitting} className="primary-btn" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', opacity: !isStepValid() || isSubmitting ? 0.5 : 1 }}>
                          Next Step <ArrowRight size={16} />
                        </button>
                      ) : (
                        <button type="submit" disabled={isSubmitting} className="primary-btn" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', opacity: isSubmitting ? 0.7 : 1 }}>
                          {isSubmitting ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : 'Submit Enquiry'}
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

const getInputStyle = (isSubmitting) => ({
  width: '100%', padding: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--white, #fff)', fontSize: '14px', marginBottom: '15px', outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', opacity: isSubmitting ? 0.5 : 1
});

const checkboxStyle = { display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', fontSize: '13px', cursor: 'pointer' };
