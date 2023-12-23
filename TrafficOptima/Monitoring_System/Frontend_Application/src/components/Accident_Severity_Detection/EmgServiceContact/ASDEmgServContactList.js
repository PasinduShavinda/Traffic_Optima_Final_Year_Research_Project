import React, { useState } from 'react';
import swal from "sweetalert";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../EmgServiceContact/ASDEmgServContactListStyles.css';

const ASDEmgServContactList = ({ services }) => {

  const [serviceType, setServiceType] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [editId, setEditId] = useState('');
  const [show, setShow] = useState(false);

  // Function to handle the closing of modal
  const handleClose = () => {
    setShow(false);
  }
  const handleShow = () => setShow(true);

  const handleDeleteEmService = (email) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this Contact details!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // Send a DELETE request to delete the Contact details with a specific NIC
        fetch(`/delEmService/${email}`, {
          method: 'DELETE',
        })
          .then((res) => {
            if (res.status === 200) {
              swal('Success!', 'Contact details has been deleted!', 'success');
              window.location.reload();
            } else {
              swal('Error', 'Failed to delete!', 'error');
            }
          })
          .catch((error) => {
            swal('Error', 'Failed to delete!', 'error');
            console.error(error);
          });
      } else {
        swal('Cancelled', 'The Contact details has not been deleted.', 'info');
      }
    });
  }

    // Get data to the update form
const handleUpdateForm = async (email) => {
  try {
    const response = await fetch(`/getEmServById/${email}`, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      handleShow();
      setServiceType(data.data.serviceType);
      setEmail(data.data.email);
      setMobileNumber(data.data.mobileNumber);
      setEditId(data.data.email);
    } else {
      console.error("Failed to retrieve data");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

  const handleUpdate = (e) => {
    e.preventDefault();
    // Create an update object with data
    let updObj = { mobileNumber, email, serviceType };
    fetch(`/getEmServById/${editId}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json', // Corrected header name
      },
      body: JSON.stringify(updObj)
    })
      .then((res) => {
        if (res.ok) {
          // Handle success: close the form, show a success message, and navigate to a new page
          handleClose();
          swal("Successful!", "Successfully Updated ✅ 👏", "success");
        } else if (res.status === 404) {
          swal("Error!", "Error when updating!", "error");
        } else {
          // Handle other error cases
          swal("Error!", "Unknown error occurred!", "error");
        }
      })
      .catch((err) => {
        console.log(err);
        swal("Error!", "Failed to update: " + err.message, "error");
      });
  }
  
  return (
    <div>
      <div className="e2_emergency-service-list">
        <h2 className="e2_h2">Emergency Services</h2>
        <ul className="e2_ul">
          {services.map((service, index) => (
            <li key={index} className="e2_service-item">
              <div className="e2_service-details">
                <strong>Type:</strong> {service.serviceType}
              </div>
              <div className="e2_service-details">
                <strong>Mobile:</strong> {service.mobileNumber}
              </div>
              <div className="e2_service-details">
                <strong>Email:</strong> {service.email}
              </div>
              &nbsp;
              <div style={{marginLeft:'140px'}}>
              <button
                className="btn btn-success"
                onClick={() => handleUpdateForm(service.email)}
              >
                Update
              </button>
              &nbsp;
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteEmService(service.email)}
              >
                Delete
              </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Modal style={{ marginTop: '10%' }} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input type="text" className="form-control" placeholder="Service Type" value={serviceType} onChange={(e) => setServiceType(e.target.value)} />
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col>
              <input type="text" className="form-control" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col>
              <input type="text" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Col>
          </Row>
          <br></br>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ASDEmgServContactList;
