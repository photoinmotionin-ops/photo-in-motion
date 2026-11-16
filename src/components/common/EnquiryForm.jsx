  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // THIS LINE IS THE FIX: We must tell the backend which action to perform
        body: JSON.stringify({ 
          action: 'submit_enquiry', 
          ...formData 
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
          setTimeout(() => { setIsSubmitted(false); setStep(1); }, 500);
        }, 3000);
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