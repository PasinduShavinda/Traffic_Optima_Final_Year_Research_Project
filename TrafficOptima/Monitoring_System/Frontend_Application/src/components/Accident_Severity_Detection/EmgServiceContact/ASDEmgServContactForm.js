import React, { useState } from 'react';
import './ASDEmgServContactFormStyles.css';

const ASDEmgServContactForm = ({ onSubmit }) => {
  const [serviceType, setServiceType] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ serviceType, mobileNumber, email });
    setServiceType('');
    setMobileNumber('');
    setEmail('');
  };

  return (
    <div className="e1_emergency-service-form">
      <h2 className='e1_h2'>Add Emergency Service</h2>
      <form onSubmit={handleSubmit}>
        <div className="e1_form-group">
          <label className='e1_label' htmlFor="serviceType">Emergency Service Type:</label>
          <input
            type="text"
            id="serviceType"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            required
          />
        </div>
        <div className="e1_form-group">
          <label className='e1_label' htmlFor="mobileNumber">Mobile Number:</label>
          <input
            type="text"
            id="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </div>
        <div className="e1_form-group">
          <label className='e1_label' htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="e1_submit-button">Save</button>
      </form>
    </div>
  );
};

export default ASDEmgServContactForm;
