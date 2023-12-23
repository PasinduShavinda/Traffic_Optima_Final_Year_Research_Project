"""
------------------------------------------------------------------------------
 File: EVP_Routes.py
 Purpose: This file contains a Flask server application for handling video streams and emergency vehicle prioritization.
 Author: IT20122096
 Date: 2023-10-30
------------------------------------------------------------------------------
"""
from concurrent.futures import ThreadPoolExecutor
from flask import Response, session, request, jsonify
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Emergency_vehicle_prioritization.Video_Generator import \
    video_generator
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Emergency_vehicle_prioritization.EV_Prioritization import \
    main
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.db import evp_logs_collection
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.evp_utills import data
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.evp_utills import intersections

video = "/Users/chamathkavindya/Ev_prioratization/yolov8/safasgas_Qxk7ZLxC.mp4"


# Function to handle video streaming for lane 1
def lane1(path, intersection):
    result = main(video_path=path['lane1'], intersection=intersection, lane="lane1")
    print(f"Path{path}")
    for res in result:
        data["lane1"] = res
        yield res["frames"]


# Function to handle video streaming for lane 2
def lane2(path, intersection):
    result = main(video_path=path['lane2'], intersection=intersection, lane="lane2")
    for res in result:
        data["lane2"] = res
        yield res["frames"]


# Function to handle video streaming for lane 3
def lane3(path, intersection):
    result = main(video_path=path['lane3'], intersection=intersection, lane="lane3")
    for res in result:
        data["lane3"] = res
        yield res["frames"]


# Function to handle video streaming for lane 4
def lane4(path, intersection):
    result = main(video_path=path['lane4'], intersection=intersection, lane="lane4")
    for res in result:
        data["lane4"] = res
        yield res["frames"]


def evp_routes(app, startPoint):
    executor = ThreadPoolExecutor(5)

    def video(lane):
        return Response(video_generator(lane), mimetype='multipart/x-mixed-replace; boundary=frame')

    @app.route('/video1', endpoint='video1')
    def vid1():
        try:
            if not session.get('evp_intersection'):
                return jsonify({'error': 'No intersection found'}), 400
            intersection = session.get('evp_intersection')
            return video(lane1(intersections[intersection], intersection))

        except Exception as e:
            return jsonify({'error': 'Something went wrong'}), 500

    @app.route(startPoint + '/evp_updates1')
    def evp_updates1():
        # return Response(generate(), mimetype='text/event-stream')
        return jsonify({
            "is_ev_detected": data["lane1"]["is_ev_detected"],
            "ev_type": data["lane1"]["ev_type"],
            "siren_light_on": data["lane1"]["siren_light_on"],
            "siren_sound_on": data["lane1"]["siren_sound_on"],
            "time_detected": data["lane1"]["time_detected"],
        })

    @app.route('/video2', endpoint='video2')
    def vid2():
        try:
            if not session.get('evp_intersection'):
                return jsonify({'error': 'No intersection found'}), 400
            intersection = session.get('evp_intersection')
            return video(lane2(intersections[intersection], intersection))

        except Exception as e:
            return jsonify({'error': 'Something went wrong'}), 500

    @app.route(startPoint + '/evp_updates2')
    def evp_updates2():
        # return Response(generate(), mimetype='text/event-stream')
        return jsonify({
            "is_ev_detected": data["lane2"]["is_ev_detected"],
            "ev_type": data["lane2"]["ev_type"],
            "siren_light_on": data["lane2"]["siren_light_on"],
            "siren_sound_on": data["lane2"]["siren_sound_on"],
            "time_detected": data["lane2"]["time_detected"],
        })

    @app.route('/video3', endpoint='video3')
    def vid3():
        try:
            if not session.get('evp_intersection'):
                return jsonify({'error': 'No intersection found'}), 400
            intersection = session.get('evp_intersection')
            return video(lane3(intersections[intersection], intersection))

        except Exception as e:
            return jsonify({'error': 'Something went wrong'}), 500

    @app.route(startPoint + '/evp_updates3')
    def evp_updates3():
        # return Response(generate(), mimetype='text/event-stream')
        return jsonify({
            "is_ev_detected": data["lane3"]["is_ev_detected"],
            "ev_type": data["lane3"]["ev_type"],
            "siren_light_on": data["lane3"]["siren_light_on"],
            "siren_sound_on": data["lane3"]["siren_sound_on"],
            "time_detected": data["lane3"]["time_detected"],
        })

    @app.route('/video4', endpoint='video4')
    def vid4():
        try:
            if not session.get('evp_intersection'):
                return jsonify({'error': 'No intersection found'}), 400
            intersection = session.get('evp_intersection')
            return video(lane4(intersections[intersection], intersection))

        except Exception as e:
            return jsonify({'error': 'Something went wrong'}), 500

    @app.route(startPoint + '/evp_updates4')
    def evp_updates4():
        # return Response(generate(), mimetype='text/event-stream')
        return jsonify({
            "is_ev_detected": data["lane4"]["is_ev_detected"],
            "ev_type": data["lane4"]["ev_type"],
            "siren_light_on": data["lane4"]["siren_light_on"],
            "siren_sound_on": data["lane4"]["siren_sound_on"],
            "time_detected": data["lane4"]["time_detected"],
        })

    @app.route('/evp_logs')
    def get_evp_logs():
        logs = list(evp_logs_collection.find())

        serialized_data = []
        for log in logs:
            log['_id'] = str(log['_id'])
            serialized_data.append(log)

        return jsonify(serialized_data)

    @app.route(startPoint + '/evp_select_intersection', methods=['GET', 'POST'])
    def get_path():
        try:
            if not request.json["intersection"]:
                return jsonify({'error': 'No intersection'}), 400

            selected_path = request.json["intersection"]
            if selected_path == '':
                return jsonify({'error': 'No intersection'}), 400

            session['evp_intersection'] = selected_path
            return jsonify({'message': 'Path sent successfully'})

        except Exception as e:
            return jsonify({'error': 'Something went wrong'}), 500
