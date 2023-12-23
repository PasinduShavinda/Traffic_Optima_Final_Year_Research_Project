import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ASDEmgServContactForm from './ASDEmgServContactForm';
import ASDEmgServContactList from './ASDEmgServContactList';
import Cookies from "js-cookie";

import '../EmgServiceContact/ASDEmgServContactMainStyle.css'

function ASDEmgServContactMain() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchEmergencyServices();
  }, []);

  const fetchEmergencyServices = async () => {
    try {
      const response = await axios.get('/accident/api/emergency-services', {
        headers: {
          Authorization: Cookies.get('token'),
        },
      })
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const addEmergencyService = async (newService) => {
    try {
      await axios.post('/accident/api/emergency-services', newService, {
        headers: {
          Authorization: Cookies.get('token'),
        },
      });
      fetchEmergencyServices();
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  return (
    <div style={{
      display: "flex",
      margin: "1rem",
      flexDirection: "column",
      width: window.innerWidth - 270,
    }}>
      <div className="a3_container">
        <div className="a3_left-component">
          <ASDEmgServContactForm onSubmit={addEmergencyService} />
        </div>
        <div className="a3_right-component">
          <ASDEmgServContactList services={services} />
        </div>
      </div>
    </div>
  );
}

export default ASDEmgServContactMain;
