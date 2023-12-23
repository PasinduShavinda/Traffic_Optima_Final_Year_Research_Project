"""
------------------------------------------------------------------------------
 File: ASD_functions.py
 Purpose: This file contains function related to accident severity detection
 Author: IT20140298
 Date: 2023-10-30
------------------------------------------------------------------------------
"""

from ultralytics import YOLO
from email.message import EmailMessage
from twilio.rest import Client
import smtplib
import cv2
import torch
import datetime
import configparser

from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.db import asd_collection, emg_srv_collection

# Define paths to configuration files and AI model
Config_Path = '/Users/pasindushv/Desktop/RP-GITLAB/2023-228/TrafficOptima/Monitoring_System/Server_Application/Flask_Server/config.ini'
ASD_Model_Path = '/Users/pasindushv/Desktop/RP-GITLAB/2023-228/TrafficOptima/Monitoring_System/Server_Application/AI_Models/Accident_Severity_Detection/ASD_model_01.pt'

# READ THE CONFIGURATIONS FILE
config = configparser.ConfigParser()
config.read(Config_Path)

# GET EMAIL CREDENTIALS
user = config['Email']['user']
password = config['Email']['password']

# GET TWILIO CREDENTIALS
twilio_account_sid = config['Twilio']['account_sid']
twilio_auth_token = config['Twilio']['auth_token']
twilio_phone_number = config['Twilio']['phone_no']

# GET THE EMERGENCY SERVICE CONTACT DETAILS
def get_emergency_service_info(service_type):
    # Define a query to retrieve emergency service details based on service type
    query = {"serviceType": service_type}

    # Fetch the document from the collection
    document = emg_srv_collection.find_one(query)

    if document:
        return {
            "mobileNumber": document.get("mobileNumber", ""),
            "email": document.get("email", "")
        }
    else:
        return None

# EMAIL SENDING FUNCTION
def email_alert(subject, body, to):
    # Create an email message
    msg = EmailMessage()
    msg.set_content(body)
    msg['subject'] = subject
    msg['to'] = to
    msg['from'] = user

    # Connect to the SMTP server and send the email
    server = smtplib.SMTP("smtp.gmail.com",
                          587)  # Create an SMTP server object for Gmail with the specified host and port
    server.starttls()  # Start a secure TLS connection with the SMTP server to encrypt communication
    server.login(user, password)
    server.send_message(msg)  # Send the email message object `msg` using the SMTP server

    server.quit()  # Close the SMTP server connection gracefully after sending the email


# SMS SENDING FUNCTION
def send_twilio_message(to_number, message_body):

    # Configure Twilio API with credentials
    account_sid = twilio_account_sid
    auth_token = twilio_auth_token

    # Create a Twilio client and send an SMS
    client = Client(account_sid, auth_token)

    client.messages.create(
        from_=twilio_phone_number,  # Twilio phone number
        body=message_body,
        to=to_number  # Recipient's phone number
    )

# VIDEO PREDICTIONS DONE BY THE YOLO V8 IMAGE CLASSIFICATION MODEL
def video_detection(path_x, accident_detected, location):
    # Create a YOLO model for object detection using the specified ASD model
    model = YOLO(ASD_Model_Path)
    video_capture = path_x
    cap = cv2.VideoCapture(video_capture)

    class_names = ["moderate-accident", "no-accident", "severe-accident"]

    # Loop to process video frames
    while cap.isOpened():
        # Read a frame from the video capture
        success, frame = cap.read()

        # Check if the frame was read successfully
        if success:
            # Perform image classification using YOLO
            results = model(frame)

            if not accident_detected:
                asd_logs = []
                send_email_alert = False  # Flag to trigger email_alert function

                # Check if YOLO detected any classes
                if results[0].probs is not None:
                    # Get detection probabilities
                    probs = results[0].probs.data
                    # Sort probabilities
                    sorted_indices = torch.argsort(probs, descending=True)

                    # Iterate through sorted probabilities
                    for idx in sorted_indices:
                        # Get class name
                        class_name = class_names[idx]
                        # Get detection confidence
                        confidence = probs[idx].item()

                        if confidence > 0.90 and class_name != "no-accident":
                            current_datetime = datetime.datetime.now()

                            asd_logs.append({
                                "Camera": "Camera 01",
                                "Location": location,
                                "Accident_Severity": class_name,
                                "Confidence": confidence,
                                "Date_Time": current_datetime,
                            })

                            if class_name == "severe-accident" and confidence > 0.90:
                                send_email_alert = True  # Trigger email alert

                            accident_detected = True

                            break

                if asd_logs:
                    asd_collection.insert_many(asd_logs)

                if send_email_alert:
                    location = asd_logs[-1]["Location"]
                    severity = asd_logs[-1]["Accident_Severity"]
                    dt = asd_logs[-1]["Date_Time"]

                    # Fetch the mobile number and email for "Ambulance Service"
                    service_info = get_emergency_service_info("Ambulance Service")

                    if service_info:
                        mobile_number = service_info["mobileNumber"]
                        email_address = service_info["email"]

                        email_body = f"️️\n\n❗️Severe Accident Happened❗️:\n\n\n 🚨 We require immediate assistance for a severe accident in {location}, \n\n\n 🛑 Location: {location}\n\n 🛑 Severity: {severity}\n\n 🛑 Date Time: {dt}\n\n\n 🚨 Kindly dispatch an ambulance urgently ‼️.\n\n\n\n"
                        email_alert("🚨 Accident Alert !! 🚨", email_body, email_address)

                        # to_number = mobile_number
                        # message_body = f"️️\n\n❗️Severe Accident Happened❗️:\n\n\n 🚨 We require immediate assistance for a severe accident in {location}, \n\n\n 🛑 Location: {location}\n\n 🛑 Severity: {severity}\n\n 🛑 Date Time: {dt}\n\n\n 🚨 Kindly dispatch an ambulance urgently ‼️.\n\n\n\n"

                        # Call the function
                        # send_twilio_message(mobile_number, message_body)

            annotated_frame = results[0].plot()  # Annotate the frame with detection results

            yield annotated_frame  # Yield the annotated frame for video streaming

        else:
            break  # Break the loop when the video ends

    cap.release()  # Release the video capture device
    cv2.destroyAllWindows()  # Close any open CV2 windows


# GENERATE THE FRAMES FROM THE PREDICTED VIDEO
def generate_frames(path_x='', location=''):
    accident_detected = False  # Initialize the flag
    yolo_output = video_detection(path_x, accident_detected, location)
    for detection_ in yolo_output:
        ref, buffer = cv2.imencode('.jpg', detection_)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
