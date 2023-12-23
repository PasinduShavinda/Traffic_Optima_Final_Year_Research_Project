"""
------------------------------------------------------------------------------
 File: wrong_way_driving_violation.py
 Purpose: This file contains a script for Identifying wrong way driving of moving object.
 Author: IT20122614
 Date: 2023-10-30
------------------------------------------------------------------------------
"""
import cv2
import numpy as np


def identify_wrong_way_driving():
    cap = cv2.VideoCapture('traffic42.mp4')
    print(cap.isOpened())
    f = 25
    w = int(1000 / (f - 1))
    end = 0

    # * object detector
    object_detector = cv2.createBackgroundSubtractorMOG2(history=None, varThreshold=None)

    # Initialize the 'previous_frame' variable before the loop
    previous_frame = None
    previous_centroid = None

    # * kernals
    kernalOp = np.ones((3, 3), np.uint8)
    kernalOp2 = np.ones((5, 5), np.uint8)
    kernalCl = np.ones((11, 11), np.uint8)
    fgbg = cv2.createBackgroundSubtractorMOG2(detectShadows=True)
    kernal_e = np.ones((5, 5), np.uint8)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        frame = cv2.resize(frame, None, fx=0.5, fy=0.5)
        height, width, _ = frame.shape

        # * Extract _roi
        roi = frame[50:height, 200:width]

        mask = object_detector.apply(roi)
        _, mask = cv2.threshold(mask, 250, 255, cv2.THRESH_BINARY)

        fgmask = fgbg.apply(roi)
        ret, imBin = cv2.threshold(fgmask, 200, 255, cv2.THRESH_BINARY)
        mask1 = cv2.morphologyEx(imBin, cv2.MORPH_OPEN, kernalOp)
        mask2 = cv2.morphologyEx(mask1, cv2.MORPH_CLOSE, kernalCl)
        e_img = cv2.erode(mask2, kernal_e)

        contours, _ = cv2.findContours(e_img, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        detections = []
        color_code = (0, 255, 0)

        for contour in contours:
            area = cv2.contourArea(contour)

            # THRESHOLD
            if area > 1000:
                x, y, w, h = cv2.boundingRect(contour)
                moments = cv2.moments(contour)
                centroid_x = int(moments['m10'] / moments['m00'])
                centroid_y = int(moments['m01'] / moments['m00'])
                # Box creation
                # cv2.rectangle(roi,(x,y),(x+w,y+h),(0,255,0),3)
                detections.append([x, y, w, h])
                if previous_centroid is not None:
                    delta_x = centroid_x - previous_centroid[0]
                    delta_y = centroid_y - previous_centroid[1]
                    print(f"delta_x: {delta_x}")
                    print(f"delta_y: {delta_y}")

                    # if delta_x > 0:
                    #     direction = "Right"
                    # elif delta_x < 0:
                    #     direction = "Left"
                    # else:
                    #     direction = "No Horizontal Movement"

                    if delta_y < 0:  # Movement is going upward
                        direction = "Up"
                        color_code = (0, 255, 0)

                    else:
                        direction = "Wrong Side"
                        color_code = (0, 0, 255)

                    # Display the direction on the frame
                    cv2.putText(frame, direction, (centroid_x, centroid_y), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                                color_code, 2)
                cv2.rectangle(roi, (x, y), (x + w, y + h), color_code, 3)
                previous_centroid = (centroid_x, centroid_y)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result



