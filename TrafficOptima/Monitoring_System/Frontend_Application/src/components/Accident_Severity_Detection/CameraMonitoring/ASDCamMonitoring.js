import React, { useState } from 'react';
import Button from "@mui/material/Button";
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import swal from "sweetalert";
import '../CameraMonitoring/ASDstylesCamMonitoring.css'
import OutputVideoComponent from './ASDOutputVideo';
import Cookies from "js-cookie";
import ResetTvIcon from '@mui/icons-material/ResetTv';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SmsIcon from '@mui/icons-material/Sms';
import MailIcon from '@mui/icons-material/Mail';

function ASDCamMonitoring() {
    const [selectedCamera, setSelectedCamera] = useState('default_cam');
    const [selectedLocation, setSelectedLocation] = useState('default_l');
    const [isCamSelected, setIsCamSelected] = useState(false);
    const [showEmailPopup, setShowEmailPopup] = useState(false);
    const [showSMSPopup, setShowSMSPopup] = useState(false);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [recipient, setRecipient] = useState('');
    const [message, setMeseage] = useState('');
    const [contact, setContact] = useState('');

    const cameraPaths = {
        default_cam: '',
        cam1_input_s: '/Users/pasindushv/Desktop/RP-GITLAB/2023-228/TrafficOptima/Monitoring_System/Server_Application/Flask_Server/Routes/Accident_Severity_Detection/static/files/s_934.mp4',
        cam2_input_s: '/Users/pasindushv/Desktop/RP-GITLAB/2023-228/TrafficOptima/Monitoring_System/Server_Application/Flask_Server/Routes/Accident_Severity_Detection/static/files/s_1315.mp4',
        cam3_input_s: '/Users/pasindushv/Desktop/RP-GITLAB/2023-228/TrafficOptima/Monitoring_System/Server_Application/Flask_Server/Routes/Accident_Severity_Detection/static/files/s_1317.mp4',
        cam4_input_s: '/Users/pasindushv/Desktop/RP-GITLAB/2023-228/TrafficOptima/Monitoring_System/Server_Application/Flask_Server/Routes/Accident_Severity_Detection/static/files/s_1329.mp4',
        cam5_input_m: '/Users/pasindushv/Desktop/RP-GITLAB/2023-228/TrafficOptima/Monitoring_System/Server_Application/Flask_Server/Routes/Accident_Severity_Detection/static/files/m_72.mp4',
        cam6_input_m: '/Users/pasindushv/Desktop/RP-GITLAB/2023-228/TrafficOptima/Monitoring_System/Server_Application/Flask_Server/Routes/Accident_Severity_Detection/static/files/m_109.mp4',
        cam7_input_m: '/Users/pasindushv/Desktop/RP-GITLAB/2023-228/TrafficOptima/Monitoring_System/Server_Application/Flask_Server/Routes/Accident_Severity_Detection/static/files/m_117.mp4',
    };

    const locationOptions = {
        default_l: '',
        location1: 'Nugegoda',
        location2: 'Rajagiriya',
        location3: 'Borella',
        location4: 'Kaduwela',
        location5: 'Kottawa',
        location6: 'Homagama',
        location7: 'Maharagama',
        location8: 'Kirulapone',

    };

    const handleCameraChange = (event) => {
        setSelectedCamera(event.target.value);
    };

    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };

    const validate = () => {
        let result = true;
        if (selectedCamera === 'default_cam' || selectedLocation === 'default_l') {
            result = false;
            swal("Failed!", "Please select the camera and the location ❗️❗️ ", "error");
        }
        return result;
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            // Get the selected camera's path and location
            const selectedCameraPath = cameraPaths[selectedCamera];
            const selectedLocationValue = locationOptions[selectedLocation];

            // Send selectedCameraPath and selectedLocationValue to the backend using a POST request.
            fetch('/accident/select_camera', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('token'),
                },
                body: JSON.stringify({ cameraPath: selectedCameraPath, location: selectedLocationValue }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data.message); // Handle the response from the backend
                    setIsCamSelected(true);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    };

    const handleReset = () => {
        setSelectedCamera('default_cam'); // Reset selected camera to default
        setSelectedLocation('default_l'); // Reset selected camera to default
        setIsCamSelected(false); // Hide the output video
        window.location.reload(false); // Refresh the page
    };

    // Function to handle the closing of modal
    const handleClose = () => {
        setBody('');
        setContact('');
        setMeseage('');
        setRecipient('');
        setSubject('');
        setShowEmailPopup(false);
        setShowSMSPopup(false);
    }

    const handleShowEmailPopup = () => setShowEmailPopup(true);
    const handleShowSMSPopup = () => setShowSMSPopup(true);

    // Email form valications

    const emailFormValidate = () => {
        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        let result = true;

        if (subject === '' || body === '' || recipient === '') {
            result = false;
            swal("Email Sending Failed!", "You must fill all the fields ❗️❗️ ", "error");
        } else if (!recipient.match(emailRegex)) {
            result = false;
            swal("Email Sending Failed!", "Incorrect email address ❗️❗️ ", "error");
        }
        return result;
    }

    // SMS form valications

    const smsFormValidate = () => {
        const mobileRegex = /^\d{10}$/;
        let result = true;

        if (contact === '' || message === '') {
            result = false;
            swal("SMS Sending Failed!", "You must fill all the fields ❗️❗️ ", "error");
        } else if (!contact.match(mobileRegex)) {
            result = false;
            swal("SMS Sending Failed!", "Incorrect email address ❗️❗️ ", "error");
        }
        return result;
    }

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        if (emailFormValidate()) {
            const data = {
                subject,
                body,
                to: recipient,
            };

            try {
                const response = await fetch('/accident/send_email', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': Cookies.get('token'),
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    swal("Successful!", "Email Successfully Sent ✅ ", "success");
                    handleClose();
                } else {
                    swal("Failed!", "Failed to send email ❗️❗️ ", "error");
                }
            } catch (error) {
                swal("Failed!", "Failed to send email ❗️❗️ ", "error");
            }
        }
    };

    const handleSubmitSMS = async (e) => {
        e.preventDefault();
        if (smsFormValidate()) {
            const data = {
                message,
                to: contact,
            };

            try {
                const response = await fetch('/accident/send_sms', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': Cookies.get('token'),
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    swal("Successful!", "SMS Successfully Sent ✅ ", "success");
                    handleClose();
                } else {
                    swal("Failed!", "Failed to send SMS ❗️❗️ ", "error");
                }
            } catch (error) {
                swal("Failed!", "Failed to send SMS ❗️❗️ ", "error");
            }
        }
    };

    return (
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <div style={{
                display: "flex",
                margin: "1%",
                flexDirection: "column",
                width: window.innerWidth - 320,
            }}>
                <div className="cm_container">
                    <div className="cm_form-column">
                        <form onSubmit={handleSubmit}>
                            <label>Location:</label>
                            <select value={selectedLocation} onChange={handleLocationChange}>
                                <option value="default_l">Select Location</option>
                                <option value="location1">Nugegoda</option>
                                <option value="location2">Rajagiriya</option>
                                <option value="location3">Borella</option>
                                <option value="location4">Kaduwela</option>
                                <option value="location5">Kottawa</option>
                                <option value="location6">Homagama</option>
                                <option value="location7">Maharagama</option>
                                <option value="location8">Kirulapone</option>
                            </select>
                            <br />
                            <label>Camera:</label>
                            <select value={selectedCamera} onChange={handleCameraChange}>
                                <option value="default_cam">Select Camera</option>
                                <option value="cam1_input_s">Camera 1 - S</option>
                                <option value="cam2_input_s">Camera 2 - S</option>
                                <option value="cam3_input_s">Camera 3 - S</option>
                                <option value="cam4_input_s">Camera 4 - S</option>
                                <option value="cam5_input_m">Camera 5 - M</option>
                                <option value="cam6_input_m">Camera 6 - M</option>
                                <option value="cam7_input_m">Camera 7 - M</option>
                            </select>
                            <br />
                            <div>
                                <Button
                                    variant="contained"
                                    endIcon={<CheckCircleIcon />}
                                    onClick={handleSubmit}
                                    style={{backgroundColor:'green'}} 
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    endIcon={<ResetTvIcon />}
                                    onClick={handleReset}
                                    style={{backgroundColor:'blue'}}  
                                >
                                    Reset
                                </Button>
                            </div>

                            <div className="smsemailBtn">
                                <Button
                                    variant="contained"
                                    endIcon={<SmsIcon />}
                                    onClick={handleShowSMSPopup}
                                    style={{ marginRight: '10px' , backgroundColor:'purple'}}  
                                >
                                    Send SMS
                                </Button>
                                <Button
                                    variant="contained"
                                    endIcon={<MailIcon />}
                                    onClick={handleShowEmailPopup}
                                    style={{backgroundColor:'purple'}}  
                                >
                                    Send Email
                                </Button>
                            </div>
                        </form>

                    </div>
                    <div className="cm_output-column">
                        {isCamSelected && <OutputVideoComponent />}
                    </div>
                </div>
            </div>

            {/* Modal Popup - EMAIL */}
            <Modal style={{ marginTop: '7%' }} show={showEmailPopup} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Send Email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <text>Subject</text>
                            <br></br>
                            <input type="text" className="form-control" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col>
                            <text>Body</text>
                            <input type="text" className="form-control" placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col>
                            <text>Email</text>
                            <input type="text" className="form-control" placeholder="Recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                        </Col>
                    </Row>
                    <br></br>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained" onClick={handleClose} style={{ marginRight: '10px' }}>
                        Close
                    </Button>
                    <Button variant="contained" onClick={handleSubmitEmail}>
                        Send Email
                    </Button>
                </Modal.Footer>
            </Modal>
            <div>
                {/* Modal Popup - SMS */}
                <Modal style={{ marginTop: '14%' }} show={showSMSPopup} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Send SMS</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <text>Message</text>
                                <br></br>
                                <input type="text" className="form-control" placeholder="Message" value={message} onChange={(e) => setMeseage(e.target.value)} />
                            </Col>
                        </Row>
                        <br></br>
                        <Row>
                            <Col>
                                <text>Recipient</text>
                                <input type="text" className="form-control" placeholder="Recipient" value={contact} onChange={(e) => setContact(e.target.value)} />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="contained" onClick={handleClose} style={{ marginRight: '10px' }}>
                            Close
                        </Button>
                        <Button variant="contained" onClick={handleSubmitSMS}>
                            Send SMS
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default ASDCamMonitoring;
