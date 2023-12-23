"""
------------------------------------------------------------------------------
 File: EV_Prioritization.py
 Purpose: This file contains the main script for the TrafficOptima Server Application.
          It processes video data to detect emergency vehicles and prioritize them based on
          siren and light signals. The results are logged to a database.
 Author: IT20122096
 Date: 2023-10-30
------------------------------------------------------------------------------
"""

from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor
from ultralytics import YOLO
from keras.models import load_model

# Import custom functions
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Emergency_vehicle_prioritization.EVDetection import \
    ev_detect
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Emergency_vehicle_prioritization.SirenLightClassification import \
    siren_light_detect
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Emergency_vehicle_prioritization.SoundClassifier import \
    run_classification
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.db import evp_logs_collection

# Dictionary to store model cache
model_cache = {}

# Dictionary to store emergency vehicle prioritization status
ev_prioritization_status = {
    "is_ev_detected": False,
    "ev_type": "Non-EV",
    "siren_light_on": False,
    "siren_sound_on": False,
    "time_detected": "",
    "frames": ""
}


# Function to load YOLO model with caching
def load_yolo_cached_model(model_path):
    if model_path in model_cache:
        return model_cache[model_path]

    # Load and initialize the model
    model = YOLO(model_path)
    model_cache[model_path] = model
    return model


# Function to load Keras CNN model with caching
def load_cnn_cached_model(model_path):
    if model_path in model_cache:
        return model_cache[model_path]

    # Load and initialize the model
    model = load_model(model_path)
    model_cache[model_path] = model
    return model


# Use load_cached_model to load models
ev_model = load_yolo_cached_model(
    "/Users/chamathkavindya/RP_Project_Repo/2023-228/TrafficOptima/Monitoring_System/Server_Application/AI_Models/Emergency_vehicle_prioritization/ev_detection_model.pt")
sr_model = load_yolo_cached_model(
    "/Users/chamathkavindya/RP_Project_Repo/2023-228/TrafficOptima/Monitoring_System/Server_Application/AI_Models/Emergency_vehicle_prioritization/siren_light_detection_model.pt")
ss_model = load_cnn_cached_model(
    '/Users/chamathkavindya/RP_Project_Repo/2023-228/TrafficOptima/Monitoring_System/Server_Application/AI_Models/Emergency_vehicle_prioritization/audio_classification.hdf5')


# Main function for processing video and detecting emergency vehicles
def main(video_path, intersection, lane):
    last_execution_time = datetime.now() - timedelta(seconds=30)

    result = ev_detect(video_path=video_path, model=ev_model)

    for res in result:
        is_ev_detected = res["out_res"]["is_ev_present"]

        time_since_last_execution = datetime.now() - last_execution_time
        # Check for siren sound and light if an emergency vehicle is detected
        if is_ev_detected:
            with ThreadPoolExecutor(max_workers=2) as executor:

                ev_prioritization_status["is_ev_detected"] = True
                ev_prioritization_status["ev_type"] = res["out_res"]["ev_class"]
                ev_prioritization_status["time_detected"] = datetime.now().strftime("%H.%M.%S")
                ev_prioritization_status["frames"] = res["out_frames"]

                if time_since_last_execution.total_seconds() >= 20:
                    last_execution_time = datetime.now()

                    future_siren_light = executor.submit(siren_light_detect, video_path, sr_model)
                    future_siren_sound = executor.submit(run_classification)

                    result_siren_light = future_siren_light.result()
                    result_siren_sound = future_siren_sound.result()

                    ev_prioritization_status["siren_light_on"] = result_siren_light
                    ev_prioritization_status["siren_sound_on"] = result_siren_sound

                    if result_siren_sound == True or result_siren_light == True:
                        log = {
                            "is_ev_detected": True,
                            "ev_type": res["out_res"]["ev_class"],
                            "siren_light_on": result_siren_light,
                            "siren_sound_on": result_siren_sound,
                            "time_detected": datetime.now().strftime("%H.%M.%S"),
                            "lane_number": lane,
                            "intersection": intersection
                        }
                        print(f"{log}")
                        evp_logs_collection.insert_one(log)

                yield ev_prioritization_status

        else:
            ev_prioritization_status["is_ev_detected"] = False
            ev_prioritization_status["ev_type"] = res["out_res"]["ev_class"]
            ev_prioritization_status["siren_light_on"] = False
            ev_prioritization_status["siren_sound_on"] = False
            ev_prioritization_status["time_detected"] = datetime.now().strftime("%H.%M.%S")
            ev_prioritization_status["frames"] = res["out_frames"]
            yield ev_prioritization_status

    executor.shutdown(wait=True)
