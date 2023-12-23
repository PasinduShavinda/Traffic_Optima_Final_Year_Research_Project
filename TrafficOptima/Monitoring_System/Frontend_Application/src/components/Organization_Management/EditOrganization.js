
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
const EditOrganization = () => {
    const { id } = useParams();
  
  const [formData, setFormData] = useState({
    organization_name: '',
    organization_email: '',
    Country: '',
    organization_address: '',
    isPlanFree: true,
  });
  const token = Cookies.get('token'); 
  useEffect(() => {
    axios
      .get(`/getone/${id}`,{
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        const { data } = response.data;
        setFormData(data);
      })
      .catch((error) => {
        console.error('Failed to fetch organization details:', error);
      });
  }, [id]);

  // const handleUpdate = () => {
  //   axios
  // .post(`http://localhost:8000/getone/${id}`, {
  //   headers: {
  //     Authorization: token,
      
  //   },
  // },formData)
  // .then(() => {
  //   Swal.fire({
  //     icon: 'success',
  //     title: 'Organization updated successfully',
  //   });
  // })
  // .catch((error) => {
  //   console.error('Failed to update organization:', error);
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Oops...',
  //     text: 'Failed to update organization!',
  //   });
  // });
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isPlanFree' ? value === 'true' : value,
    });
  };
  
  const handleUpdate = () => {
    axios
      .post(`/update/${id}`, {
        headers: {
          Authorization: token,
        },
      },formData)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Organization updated successfully',
        });
      })
      .catch((error) => {
        console.error('Failed to update organization:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to update organization!',
        });
      });
  };

  return (
    <div style={{
      display: "flex",
      margin: "3rem",
      flexDirection: "column",
      width: window.innerWidth - 270,
  }}>
    <div className="container mt-5">
      <h2 className="text-center mb-4">Edit Organization</h2>
      <form>
        <div className="form-group">
          <label htmlFor="organization_name">Organization Name:</label>
          <input
            type="text"
            id="organization_name"
            name="organization_name"
            className="form-control"
            value={formData.organization_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="organization_email">Organization Email:</label>
          <input
            type="email"
            id="organization_email"
            name="organization_email"
            className="form-control"
            value={formData.organization_email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Country">Country:</label>
          <input
            type="text"
            id="Country"
            name="Country"
            className="form-control"
            value={formData.Country}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="organization_address">Organization Address:</label>
          <input
            type="text"
            id="organization_address"
            name="organization_address"
            className="form-control"
            value={formData.organization_address}
            onChange={handleInputChange}
          />
        </div>
        {/* <div className="form-group">
          <label htmlFor="isPlanFree">isPlanFree:</label>
          <select
            id="isPlanFree"
            name="isPlanFree"
            className="form-control"
            value={formData.isPlanFree}
            onChange={handleInputChange}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </div> */}
        <button type="button" className="btn btn-primary" onClick={handleUpdate}>
          Submit
        </button>
      </form>
    </div>
    </div>
  );
};

export default EditOrganization;
