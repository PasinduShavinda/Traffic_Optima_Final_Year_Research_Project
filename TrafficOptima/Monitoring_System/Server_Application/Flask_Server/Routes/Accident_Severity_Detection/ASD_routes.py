"""
------------------------------------------------------------------------------
 File: ASD_routes.py
 Purpose: This file contains routes related to accident severity detection
 Author: IT20140298
 Date: 2023-10-30
------------------------------------------------------------------------------
"""

from flask import Response, session, request, jsonify
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Accident_Severity_Detection.ASD_functions import \
    generate_frames, email_alert, send_twilio_message
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.db import asd_collection, emg_srv_collection

def init_asd_routes(app, startPoint):
    @app.route('/', methods=['GET', 'POST'])
    # ROUT FOR THE CAMERA SELECTION
    @app.route(startPoint + '/select_camera', methods=['GET', 'POST'])
    def select_camera():
        try:
            # Check if the 'cameraPath' key is present in the JSON request
            if 'cameraPath' not in request.json:
                return jsonify({'error': 'Invalid request'}), 400

            # Retrieve the selected camera path and location from the request JSON
            selected_camera_path = request.json['cameraPath']
            selected_location = request.json.get('location')

            # Store the selected camera path and location in the session
            session['video_path'] = selected_camera_path
            session['selected_loc'] = selected_location

            # Handle exceptions and return an error response
            return jsonify({'message': 'Camera selected successfully', 'cameraPath': selected_camera_path,
                            'location': selected_location}), 200
        except Exception as e:
            return jsonify({'error': 'An error occurred'}), 500

    # ROUT FOR VIDEO PREDICTIONS
    @app.route('/video')
    def video():
        try:
            # Retrieve the video path and location from the session
            video_path = session.get('video_path', None)
            loc = session.get('selected_loc', None)

            if video_path:
                # Stream video frames with annotations using the generate_frames function
                return Response(generate_frames(path_x=video_path, location=loc),
                                mimetype='multipart/x-mixed-replace; boundary=frame')
            else:
                return "No video path found in the session."

        except Exception as e:
            print(f"Exception Occurred: {e}")

    # ROUT FOR GET ALL LOGS
    @app.route(startPoint + '/getASDlogs')
    def get_asd_data():
        # Fetch ASD logs data from MongoDB
        data = list(asd_collection.find())  # Fetch data from MongoDB

        # Convert ObjectId to string for each document
        serialized_data = []
        for entry in data:
            entry['_id'] = str(entry['_id'])
            serialized_data.append(entry)

        return jsonify(serialized_data)

    # ROUT FOR EMAIL SENDING - MANUAL
    @app.route(startPoint + '/send_email', methods=['POST'])
    def send_email():
        data = request.json
        subject = data.get('subject')
        body = data.get('body')
        to = data.get('to')

        try:
            # Call the email_alert function with the provided data
            email_alert(subject, body, to)
            return jsonify({"message": "Email sent successfully"})
        except Exception as e:
            # Handle exceptions and return an error response if email sending fails
            return jsonify({"message": "Failed to send email", "error": str(e)}), 500

    # ROUT FOR GET EMERGENCY SERVICE CONTACT DETAILS
    @app.route(startPoint + '/api/emergency-services', methods=['GET'])
    def get_services():
        # Fetch emergency service contact details from MongoDB
        services = list(emg_srv_collection.find())
        # Convert ObjectId to string for each document and serialize data
        serialized_data = []
        for entry in services:
            entry['_id'] = str(entry['_id'])
            serialized_data.append(entry)
        return jsonify(serialized_data), 200

    # SAVE EMG SERVICE CONTACT
    @app.route(startPoint + '/api/emergency-services', methods=['POST'])
    def add_service():
        new_service = request.json
        # Insert a new emergency service contact into the collection
        emg_srv_collection.insert_one(new_service)
        return jsonify({'message': 'Service added successfully'}), 201

    # ROUT FOR SMS SENDING - MANUAL
    @app.route(startPoint + '/send_sms', methods=['POST'])
    def send_sms():
        data = request.json
        body = data.get('body')
        to = data.get('to')

        try:
            # Call the send_twilio_message function with the provided data to send an SMS
            send_twilio_message(to, body)
            return jsonify({"message": "SMS sent successfully"})
        except Exception as e:
            # Handle exceptions and return an error response if SMS sending fails
            return jsonify({"message": "Failed to send SMS", "error": str(e)}), 500

    # GET EMERGENCY SERVICE BY EMAIL AND UPDATE
    @app.route('/getEmServById/<email>', methods=['GET', 'POST'])
    def get_service_by_id(email):
        data = {}
        code = 500
        try:
            if request.method == 'POST':
                res = emg_srv_collection.update_one({"email": email},
                                                    {"$set": request.get_json()})
                if res:
                    message = "Updated successfully"
                    status = "successful"
                    code = 201
                else:
                    message = "Update failed"
                    status = "fail"
                    code = 404
            else:
                data = emg_srv_collection.find_one({"email": email})
                data['_id'] = str(data['_id'])
                if data:
                    message = "Item found"
                    status = "successful"
                    code = 200
                else:
                    message = "Update failed"
                    status = "fail"
                    code = 404
        except Exception as ee:
            message = str(ee)
            status = "Error"

        return jsonify({"status": status, "message": message, 'data': data}), code

    # DELETE EMERGENCY SERVICE
    @app.route('/delEmService/<email>', methods=['DELETE'])
    def delete_service(email):
        data = {}
        code = 500
        try:
            if request.method == 'DELETE':
                res = emg_srv_collection.delete_one({"email": email})
                if res:
                    message = "Delete successfully"
                    status = "successful"
                    code = 200
                else:
                    message = "Delete failed"
                    status = "fail"
                    code = 404
            else:
                message = "Delete Method failed"
                status = "fail"
                code = 404
        except Exception as ee:
            message = str(ee)
            status = "Error"

        return jsonify({"status": status, "message": message, 'data': data}), code
