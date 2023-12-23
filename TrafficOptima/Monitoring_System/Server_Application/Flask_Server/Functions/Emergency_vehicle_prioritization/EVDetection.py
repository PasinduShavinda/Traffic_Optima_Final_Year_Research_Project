"""
------------------------------------------------------------------------------
 File: EVDetection.py
 Purpose: This file contains a script for detecting emergency vehicles in a video stream and analyzing their presence.
 Author: IT20122096
 Date: 2023-10-30
------------------------------------------------------------------------------
"""

import cv2
from collections import deque
from ultralytics import YOLO

# Define the path to the video file
video = "/Users/chamathkavindya/Ev_prioratization/yolov8/videoplayback2.mp4"

# Load the YOLO model for emergency vehicle detection
ev_model = YOLO(
    "/Users/chamathkavindya/RP_Project_Repo/2023-228/TrafficOptima/Monitoring_System/Server_Application/AI_Models/Emergency_vehicle_prioritization/ev_detection_model.pt")

# Function to check for emergency vehicle presence based on predictions
def check_emergency_presence(predictions_buffer):
    # List of emergency vehicle classes
    emergency_classes = ['Ambulance', 'Fire-Truck', 'Police-Vehicle']

    # Initialize counters
    ev_count = 0
    no_detection_count = 0
    ambulance_count = 0
    fire_truck_count = 0
    police_vehicle_count = 0

    # Dictionary to store counts
    counts = {
        'Ambulance': ambulance_count,
        'Fire-Truck': fire_truck_count,
        'Police-Vehicle': police_vehicle_count
    }

    # Output data
    out_put = {
        "ev_class": "Non-EV",
        "is_ev_present": False,
    }

    for predictions in predictions_buffer:
        if len(predictions) > 0:
            emergency_count = sum(1 for pred in predictions if pred in emergency_classes)
            for pred in predictions:
                if pred == "Ambulance":
                    counts['Ambulance'] = counts['Ambulance'] + 1
                if pred == "Fire-Truck":
                    counts['Fire-Truck'] = counts['Fire-Truck'] + 1
                if pred == "Police-Vehicle":
                    counts['Police-Vehicle'] = counts['Police-Vehicle'] + 1
            if emergency_count >= 1:
                ev_count += 1
        else:
            no_detection_count += 1

    frames_without_no_predictions = len(predictions_buffer) - no_detection_count

    if frames_without_no_predictions > 0:
        if ev_count / frames_without_no_predictions >= 0.7:
            ev_type = max(counts, key=counts.get)
            out_put["ev_class"] = ev_type
            out_put["is_ev_present"] = True
            return out_put

    return out_put

# Function for emergency vehicle detection
def ev_detect(video_path=video, model=ev_model):
    cap = cv2.VideoCapture(video_path)

    frame_interval = 0.2
    frame_rate = int(cap.get(cv2.CAP_PROP_FPS))
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    total_time = frame_count / frame_rate

    current_time = 0
    current_frame = 0

    buffer_size = 25
    predictions_buffer = deque(maxlen=buffer_size)

    class_labels = ['Ambulance', 'Fire-Truck', 'Police-Vehicle', 'Non-Emergency', 'Person']
    class_colors = [(0, 0, 255), (0, 255, 0), (255, 0, 0), (0, 255, 255), (255, 255, 0)]

    # Dictionary to store output frames and results
    frames_with_output = {
        "out_frames": "",
        "out_res": {
            "ev_class": "Non-EV",
            "is_ev_present": False,
        }
    }

    while current_time <= total_time:
        cap.set(cv2.CAP_PROP_POS_FRAMES, current_frame)
        ret, frame = cap.read()

        if not ret:
            break

        results = model.predict(frame, conf=0.5)
        bboxes = results[0].boxes
        predictions = [class_labels[int(bbox.cls)] for bbox in bboxes]
        predictions_buffer.append(predictions)

        if len(predictions_buffer) == 25:
            res = check_emergency_presence(predictions_buffer)
            predictions_buffer.clear()
            frames_with_output["out_res"] = res

        for bbox in bboxes:
            x1, y1, x2, y2 = bbox.xyxy[0]
            confidence = float(bbox.conf)
            class_id = int(bbox.cls)

            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), class_colors[class_id], 2)
            cv2.putText(frame, f"{class_labels[class_id]}: {confidence:.2f}", (int(x1), int(y1) - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9,
                        class_colors[class_id], 2)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
        frames_with_output["out_frames"] = frame
        yield frames_with_output

        current_time += frame_interval
        current_frame = int(current_time * frame_rate)

    cap.release()
    cv2.destroyAllWindows()
