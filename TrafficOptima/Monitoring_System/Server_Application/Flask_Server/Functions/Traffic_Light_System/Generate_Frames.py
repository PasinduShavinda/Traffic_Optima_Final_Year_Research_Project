"""
------------------------------------------------------------------------------
 File: Generate_Frames.py
 Purpose: This file contains a functions for generates frames from vedio
 Author: IT20137700
 Date: 2023-10-30
------------------------------------------------------------------------------
"""

import cv2

from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Lane01 import Lane01_detection
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Lane02 import Lane02_detection
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Lane03 import Lane03_detection
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Lane04 import Lane04_detection
my_dict = {}
my_dict['lane1'] = 0
my_dict['lane2'] = 0
my_dict['lane3'] = 0
my_dict['lane4'] = 0
my_dict['lane1_Bus'] = 0
my_dict['lane2_Bus'] = 0
my_dict['lane3_Bus'] = 0
my_dict['lane4_Bus'] = 0
from collections import deque

# Create a circular buffer of size 100
buffer_size = 20
circular_buffer1 = deque(maxlen=buffer_size)
circular_buffer2 = deque(maxlen=buffer_size)
circular_buffer3 = deque(maxlen=buffer_size)
circular_buffer4 = deque(maxlen=buffer_size)

def generate_frames(path_x=''):
    for frame, que_count,bus_count in Lane01_detection(path_x):
        ref, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        my_dict['lane1'] = que_count
        my_dict['lane1_Bus'] = bus_count
        circular_buffer1.append(que_count)
        my_dict['lane1_data01']= list(circular_buffer1)
        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
        )


def generate_frames2(path_x=''):
    for frame, que_count,bus_count in Lane02_detection(path_x):
        ref, buffer = cv2.imencode('.jpg', frame)
        my_dict['lane2'] = que_count
        my_dict['lane2_Bus'] = bus_count
        circular_buffer2.append(que_count)
        frame_bytes = buffer.tobytes()
        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
        )

def generate_frames3(path_x=''):
    for frame, que_count,bus_count in Lane03_detection(path_x):
        ref, buffer = cv2.imencode('.jpg', frame)
        my_dict['lane3'] = que_count
        my_dict['lane3_Bus'] = bus_count
        circular_buffer3.append(que_count)
        frame_bytes = buffer.tobytes()
        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
        )


def generate_frames4(path_x=''):
    for frame, que_count,bus_count in Lane04_detection(path_x):
        ref, buffer = cv2.imencode('.jpg', frame)
        my_dict['lane4'] = que_count
        my_dict['lane4_Bus'] = bus_count
        circular_buffer4.append(que_count)
        frame_bytes = buffer.tobytes()
        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
        )

