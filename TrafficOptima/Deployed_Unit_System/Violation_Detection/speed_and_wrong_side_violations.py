import cv2
import numpy as np

from TrafficOptima.Deployed_Unit_System.Violation_Detection.Speed_tracking import Euclidean_distance_tracker


def tracking_speed_vehicles(video_name):
    end = 0

    tracker = Euclidean_distance_tracker()

    cap = cv2.VideoCapture(video_name)

    f = 25
    w = int(1000 / (f - 1))

    # * object detector
    object_detector_using_MOG2 = cv2.createBackgroundSubtractorMOG2(history=None, varThreshold=None)

    # Initialize the 'previous_frame' variable before the loop
    previous_frame = None
    previous_centroid = None

    # *kernals
    kernalOp = np.ones((3, 3), np.uint8)
    kernalOp2 = np.ones((5, 5), np.uint8)
    kernalCl = np.ones((11, 11), np.uint8)
    fgbg = cv2.createBackgroundSubtractorMOG2(detectShadows=True)
    kernal_e = np.ones((5, 5), np.uint8)

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, None, fx=0.5, fy=0.5)
        height, width, _ = frame.shape

        # * Extract_Return_on_Investment
        return_extract_investment = frame[50:height, 200:width]

        mask = object_detector_using_MOG2.apply(return_extract_investment)
        _, mask = cv2.threshold(mask, 250, 255, cv2.THRESH_BINARY)

        fgmask = fgbg.apply(return_extract_investment)
        ret, imBin = cv2.threshold(fgmask, 200, 255, cv2.THRESH_BINARY)
        mask1 = cv2.morphologyEx(imBin, cv2.MORPH_OPEN, kernalOp)
        mask2 = cv2.morphologyEx(mask1, cv2.MORPH_CLOSE, kernalCl)
        e_img = cv2.erode(mask2, kernal_e)

        contours, _ = cv2.findContours(e_img, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        detections = []
        color_code = (0, 255, 0)

        for cnt in contours:
            area = cv2.contourArea(cnt)
            # THRESHOLD
            if area > 1000:
                x, y, w, h = cv2.boundingRect(cnt)
                cv2.rectangle(return_extract_investment, (x, y), (x + w, y + h), (0, 255, 0), 3)
                # new
                moments = cv2.moments(cnt)
                centroid_x = int(moments['m10'] / moments['m00'])
                centroid_y = int(moments['m01'] / moments['m00'])
                detections.append([x, y, w, h])
                if previous_centroid is not None:
                    delta_x = centroid_x - previous_centroid[0]
                    delta_y = centroid_y - previous_centroid[1]
                    # print(f"delta_x: {delta_x}")
                    # print(f"delta_y: {delta_y}")
                    #
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
                    cv2.putText(frame, direction, (centroid_x, centroid_y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color_code,
                                2)
                cv2.rectangle(return_extract_investment, (x, y), (x + w, y + h), color_code, 3)
                previous_centroid = (centroid_x, centroid_y)

        # Object_Tracking
        boxes_ids = tracker.update(detections)
        for box_id in boxes_ids:
            x, y, w, h, id = box_id

            if (tracker.getspeed(id) < tracker.limit()):
                cv2.putText(return_extract_investment, str(id)+" >>>"+str(tracker.getspeed(id))+" km/h", (x, y - 15),
                            cv2.FONT_HERSHEY_PLAIN, 1, (255, 255, 0), 2)
                cv2.rectangle(return_extract_investment, (x, y), (x + w, y + h), (0, 255, 0), 3)
            else:
                cv2.putText(return_extract_investment, str(id)+ " >>>"+str(tracker.getspeed(id))+" km/h", (x, y - 15),
                            cv2.FONT_HERSHEY_PLAIN, 1, (0, 0, 255), 2)
                cv2.rectangle(return_extract_investment, (x, y), (x + w, y + h), (0, 165, 255), 3)

            s = tracker.getspeed(id)
            if (tracker.f[id] == 1 and s != 0):
                tracker.capture(return_extract_investment, x, y, h, w, s, id)

        # DRAW_LINES TO TRACK THE VEHICLES

        # line_1
        frame_height, frame_width = return_extract_investment.shape[:2]

        line_y_pos_1 = int(frame_height * 0.7)  # 90% from top
        line_y_pos_2 = int(frame_height * 0.75)  # 95% from top

        cv2.line(return_extract_investment, (0, line_y_pos_1), (width, line_y_pos_1), (255, 0, 0), 2)
        cv2.line(return_extract_investment, (0, line_y_pos_2), (width, line_y_pos_2), (255, 0, 0), 2)

        # line_2
        cv2.line(return_extract_investment, (0, (line_y_pos_1 - 100)), (width, (line_y_pos_1 - 100)), (0, 0, 255), 2)
        cv2.line(return_extract_investment, (0, (line_y_pos_1 - 75)), (width, (line_y_pos_1 - 75)), (0, 0, 255), 2)
