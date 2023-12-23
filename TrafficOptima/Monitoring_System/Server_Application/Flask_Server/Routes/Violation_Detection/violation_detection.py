"""
------------------------------------------------------------------------------
 File: violation_detection.py
 Purpose: This file contains a script for Routing in Violations.
 Author: IT20122614
 Date: 2023-10-30
------------------------------------------------------------------------------
"""
from flask import Flask, render_template, request, url_for, redirect, Response, jsonify

from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Violation_Detection.Wrong_Way.wrong_way_driving_violation import identify_wrong_way_driving
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Violation_Detection.Speed_Tracking.speed_detecting import tracking_speed_vehicles
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Violation_Detection.Helmet_Violations.helmet_violations import helmet_violation_detection



def init_violation_detection(app, startPoint):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/video_feed')
    def video_feed():
        return Response(identify_wrong_way_driving(), mimetype='multipart/x-mixed-replace; boundary=frame')

    @app.route('/speed_detection')
    def speed_detection():
        return Response(tracking_speed_vehicles("traffic4.mp4"), mimetype='multipart/x-mixed-replace; boundary=frame')

    @app.route('/helmet_detection')
    def helmet_violation_detection_route():
        return Response(helmet_violation_detection(), mimetype='multipart/x-mixed-replace; boundary=frame')

    @app.route('/display_data', methods=('GET', 'POST'))
    def store_in_db():
        from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.db import violations
        data = {
            "vehicle_id": 2,
            "speed": 120,
            "status": "exceeded"
        }
        result = violations.insert_one(data)
        all_todos = violations.find()
        if result.acknowledged:

            return jsonify({"message": "Data inserted successfully", "inserted_id": str(result.inserted_id)})
        else:
            return jsonify({"message": "Failed to insert data"})

    @app.route('/recorded-violations')
    def load_records_in_violations():
        from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.db import violations
        all_todos = violations.find()
        records = []
        for row in all_todos:
            data = {
                "vehicle_id": row['vehicle_id'],
                "speed": row['speed'],
                "status": row['status'],
                "file_name": row['file_name']
            }
            records.append(data)
            # print(f"speed{records}")
        return jsonify(records)

    @app.route('/wrong_side_detection')
    def speed_detection_with_wrong_side():
        return Response(tracking_speed_vehicles("test.mp4"), mimetype='multipart/x-mixed-replace; boundary=frame')

    @app.route(startPoint+'/last-recorded-violations')
    def last_records_in_violations():
        from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.db import violations
        all_todos = violations.find()
        records = []
        for row in all_todos:
            data = {
                "vehicle_id": row['vehicle_id'],
                "speed": row['speed'],
                "status": row['status'],
                "file_name": row['file_name']
            }
            records.append(data)
            # print(f"last_records_in_violations{records}")
        return jsonify(records)

