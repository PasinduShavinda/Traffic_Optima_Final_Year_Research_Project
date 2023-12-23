"""
------------------------------------------------------------------------------
 File: SirenLightClassification.py
 Purpose: This file contains a script for detecting siren light in a video stream and determining its state (On/Off).
 Author: IT20122096
 Date: 2023-10-30
------------------------------------------------------------------------------
"""
import cv2
from PIL import Image
from skimage.feature import hog
from skimage.filters import threshold_otsu
from ultralytics import YOLO

# Define the path to the video file
video = "/Users/chamathkavindya/Ev_prioratization/yolov8/videoplayback4.mp4"

# Load the YOLO model for siren light detection
sr_model = YOLO(
    "/Users/chamathkavindya/RP_Project_Repo/2023-228/TrafficOptima/Monitoring_System/Server_Application/AI_Models/Emergency_vehicle_prioritization/siren_light_detection_model.pt")


def siren_light_detect(video_path=video, model=sr_model):
    cap = cv2.VideoCapture(video)

    # parameters for frame extraction
    frame_interval = 0.09
    frame_rate = int(cap.get(cv2.CAP_PROP_FPS))
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    total_time = frame_count / frame_rate

    current_time = 0
    current_frame = 0

    # HOG parameters
    orientations = 9
    pixels_per_cell = (8, 8)
    cells_per_block = (2, 2)

    siren_on_state_count = 0

    while current_time <= total_time:
        cap.set(cv2.CAP_PROP_POS_FRAMES, current_frame)
        ret, frame = cap.read()

        if not ret:
            break

        frame_pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        # object detection on the frame using YOLOv8 model
        results = model.predict(frame_pil, conf=0.50)

        # Get the bounding box
        bboxes = results[0].boxes

        for bbox in bboxes:
            x1, y1, x2, y2 = bbox.xyxy[0]
            confidence = float(bbox.conf)

            # Extract the siren light region from the frame
            siren_light = frame[int(y1):int(y2), int(x1):int(x2)]

            # Convert the siren light region to grayscale
            siren_light_gray = cv2.cvtColor(siren_light, cv2.COLOR_BGR2GRAY)

            # Apply HOG feature extraction
            features = hog(siren_light_gray, orientations=orientations, pixels_per_cell=pixels_per_cell,
                           cells_per_block=cells_per_block, visualize=False)

            # Reshape the feature array
            features = features.reshape(1, -1)

            # Perform thresholding based on image intensity
            threshold = threshold_otsu(siren_light_gray)
            intensity = features.mean()
            if intensity < threshold:
                siren_state = "On"
                siren_on_state_count += 1
            else:
                siren_state = "Off"

            if siren_on_state_count < 0:
                siren_on_state_count = 0

            if siren_on_state_count > 1:
                return True

        current_time += frame_interval
        current_frame = int(current_time * frame_rate)

    cap.release()
    cv2.destroyAllWindows()
