"""
------------------------------------------------------------------------------
 File: Lane04.py
 Purpose: This file contains a functions vechicle count detection for lane04
 Author: IT20137700
 Date: 2023-10-30
------------------------------------------------------------------------------
"""
import warnings
import cv2
from ultralytics import YOLO
from tqdm import tqdm
import pandas as pd
import os
import subprocess


def filter_warning(message, category, filename, lineno, file=None, line=None):
    if 'source' in str(message):
        return None
    else:
        return warnings.formatwarning(message, category, filename, lineno, file, line)



# Yolo_model
model = YOLO("yolov8x.pt")
all_classes = model.model.names

# Scaling Factor
scaling_fraction = 0.5

# Vehicle classess
vehicle_class = [2, 3, 5, 7]

verbose = False
warnings.showwarning = filter_warning


def Lane04_detection(video_path):


    traffic_video = cv2.VideoCapture(video_path)


    count_in = 0
    count_out = 0
    # entering_que_count = 0
    line_cx_upper = int(50 * scaling_fraction)
    line_cx_lower = int(600 * scaling_fraction)

    direction_cx = int(2000 * scaling_fraction)
    offset = int(8 * scaling_fraction)

    # Define count dictionaries
    entering_count = dict.fromkeys(vehicle_class, 0)
    departure_count = dict.fromkeys(vehicle_class, 0)

    maximum_waiting_time = 0
    total_frames = int(traffic_video.get(cv2.CAP_PROP_FRAME_COUNT))
    for i in tqdm(range(total_frames)):

        _, f = traffic_video.read()  # reading frame by frame
        frame_dimension = (int(f.shape[1] * scaling_fraction)), (int(f.shape[0] * scaling_fraction))


        frame = cv2.resize(f, frame_dimension, interpolation=cv2.INTER_AREA)

        predicted_class = model.predict(frame, conf=0.7, classes=vehicle_class, verbose=False)
        classes = predicted_class[0].boxes.cls.cpu().numpy()

        instance_frame = pd.DataFrame(predicted_class[0].cpu().numpy().boxes.data,
                                      columns=['x_min', 'y_min', 'x_max', 'y_max', 'confidence_level', 'class'])
        class_labels = [all_classes[i] for i in classes]

        cv2.line(frame, (0, line_cx_upper), (int(4500 * scaling_fraction), line_cx_upper), (255, 0, 0), 8)
        cv2.line(frame, (0, line_cx_lower), (int(4500 * scaling_fraction), line_cx_lower), (255, 0, 0), 8)

        que_count = 0
        bus_count = 0
        for idx, row in enumerate(instance_frame.iterrows()):

            # iterate over instance dataframe
            xmin, ymin, xmax, ymax, confidence, name, = row[1].astype('int')

            # Finding center coordinates of vehicle bounding boxes
            c_x, c_y = int(((xmax + xmin)) / 2), int((ymax + ymin) / 2)
            # draw bounding boxes
            cv2.rectangle(frame, (xmin, ymin), (xmax, ymax), (0, 255, 0), 6)

            # drawing center and put text on the images
            cv2.circle(frame, (c_x, c_y), 5, (255, 0, 0), -1)
            cv2.putText(img=frame, text=class_labels[idx],
                        org=(xmin, ymin - 10), fontFace=cv2.FONT_HERSHEY_TRIPLEX, fontScale=1, color=(0, 255, 0),
                        thickness=1)

            if (c_y > line_cx_upper) and c_y < (line_cx_lower):
                if (c_x >= 0) and (c_x <= direction_cx):
                    if name == 5:
                        bus_count += 1
                    else:
                        que_count += 1

            # logic for entering departing count
            if (c_y < (line_cx_upper + offset)) and (c_y > (line_cx_upper - offset)):

                if (c_x >= 0) and (c_x <= direction_cx):

                    count_in += 1
                    entering_count[name] += 1
                else:
                    count_out += 1
                    departure_count[name] += 1


        cv2.putText(img=frame, text=f'Count :{que_count}',
                    org=(30, 30),
                    fontFace=cv2.FONT_HERSHEY_TRIPLEX, fontScale=1, color=(255, 255, 0), thickness=2)
        cv2.putText(img=frame, text=f'bus_count in : {bus_count}',
                    org=(30, 65),
                    fontFace=cv2.FONT_HERSHEY_TRIPLEX, fontScale=1, color=(255, 255, 0), thickness=2)

        yield frame,que_count,bus_count


cv2.destroyAllWindows()