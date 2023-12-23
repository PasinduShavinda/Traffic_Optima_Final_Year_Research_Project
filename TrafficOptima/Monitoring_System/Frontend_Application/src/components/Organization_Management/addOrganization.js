import React, { useState } from 'react';
import swal from 'sweetalert';
const AddOrganizations = () => {
  const [organization_name, setorganization_name] = useState("");
  const [Country, setCountry] = useState(""); 
  const [organization_email, setorganization_email] = useState("");
  const [organization_address, setorganization_address] = useState("");
  const [isPlanFree, setisPlanFree] = useState("");
  const [email, setemail] = useState("");
  const[organization_admin_email,setorganization_admin_email] = useState("")
  const[password,setPassword]= useState("")
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const organization = {
        organization_name: organization_name,
        Country: Country,
        organization_email: organization_email,
        organization_address: organization_address,
        isPlanFree: true,
        email: email,
      };
  
      const response = await fetch('/organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organization),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        try {
          const user = {
            organization_name: organization_name,
            organization_id: data.data._id,
            employee_no: null,
            email: email,
            password: password,
            permissions: null,
          };
  
          const userResponse = await fetch('/new-org-admin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          });
  
          if (userResponse.ok) {
            swal("Successful!", "Create Organization Successful ✅ 👏", "success");
            // Clear input fields on success
            setorganization_name("");
            setCountry("");
            setorganization_email("");
            setorganization_address("");
            setemail("");
            setPassword("");
          } else {
            console.error('Failed to save the item');
            swal("Error", "Failed to create Organization. Please try again.", "error");
          }
        } catch (error) {
          console.error('Error:', error);
          swal("Error", "Failed to create Organization. Please try again.", "error");
        }
      } else {
        console.error('Failed to save the item');
        swal("Error", "Failed to create Organization. Please try again.", "error");
      }
    } catch (error) {
      console.error('Error:', error);
      swal("Error", "Failed to create Organization. Please try again.", "error");
    }
  };
  

 

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div >
          <div className="card">
            <div className="card-header">
              <h2 className="text-center">Add Organization</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="organization_name">Organization Name:</label>
                  <input
                    type="text"
                    id="organization_name"
                    name="organization_name"
                    className="form-control"
                    onChange={(e) => setorganization_name(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Country">Country:</label>
                  <input
                    type="text"
                    id="Country"
                    name="Country"
                    className="form-control"
                    
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="organization_email">Organization Email:</label>
                  <input
                    type="email"
                    id="organization_email"
                    name="organization_email"
                    className="form-control"
                    
                    onChange={(e) => setorganization_email(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="organization_address">Organization Address:</label>
                  <input
                    type="text"
                    id="organization_address"
                    name="organization_address"
                    className="form-control"
                    
                    onChange={(e) => setorganization_address(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="organization_address">Organization admin email:</label>
                  <input
                    type="text"
                    id="organization_address"
                    name="email"
                    className="form-control"
                    
                    onChange={(e) => setemail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="organization_address">Organization admin password</label>
                  <input
                    type="password"
                    id="organization_address"
                    name="organization_address"
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrganizations;
