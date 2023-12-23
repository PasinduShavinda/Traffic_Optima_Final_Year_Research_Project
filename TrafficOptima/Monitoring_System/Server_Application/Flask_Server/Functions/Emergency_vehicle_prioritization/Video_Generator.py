"""
------------------------------------------------------------------------------
 File: Video_Generator.py
 Purpose: This file contains a script for generating a video from frames.
 Author: IT20122096
 Date: 2023-10-30
------------------------------------------------------------------------------
"""
import cv2


# generate video  from frames
def video_generator(func):
    yolo_output = func
    for detection_ in yolo_output:
        ref, buffer = cv2.imencode('.jpg', detection_)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
