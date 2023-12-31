import cv2
from SpeedTracker import *
import numpy as np
end = 0

tracker = EuclideanDistTracker()

cap = cv2.VideoCapture("Resources/traffic4.mp4")

f = 25
w = int(1000/(f-1))

# * object detector
object_detector = cv2.createBackgroundSubtractorMOG2(history=None,varThreshold=None)

# * kernals
kernalOp = np.ones((3,3),np.uint8)
kernalOp2 = np.ones((5,5),np.uint8)
kernalCl = np.ones((11,11),np.uint8)
fgbg=cv2.createBackgroundSubtractorMOG2(detectShadows=True)
kernal_e = np.ones((5,5),np.uint8)

while True:
    ret,frame = cap.read()
    if not ret:
        break
    frame = cv2.resize(frame, None, fx=0.5, fy=0.5)
    height,width,_ = frame.shape

    # * Extract Return on Investment
    return_investment = frame[50:height, 200:width]

    mask = object_detector.apply(return_investment)
    _, mask = cv2.threshold(mask, 250, 255, cv2.THRESH_BINARY)

    fgmask = fgbg.apply(return_investment)
    ret, imBin = cv2.threshold(fgmask, 200, 255, cv2.THRESH_BINARY)
    mask1 = cv2.morphologyEx(imBin, cv2.MORPH_OPEN, kernalOp)
    mask2 = cv2.morphologyEx(mask1, cv2.MORPH_CLOSE, kernalCl)
    e_img = cv2.erode(mask2, kernal_e)


    contours,_ = cv2.findContours(e_img,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
    detections = []

    for cnt in contours:
        area = cv2.contourArea(cnt)
        #THRESHOLD
        if area > 1000:
            x,y,w,h = cv2.boundingRect(cnt)
            cv2.rectangle(return_investment,(x,y),(x+w,y+h),(0,255,0),3)
            detections.append([x,y,w,h])

    #Object_Tracking
    boxes_ids = tracker.update(detections)
    for box_id in boxes_ids:
        x,y,w,h,id = box_id


        if(tracker.getsp(id)<tracker.limit()):
            cv2.putText(return_investment,str(id)+" "+str(tracker.getsp(id)),(x,y-15), cv2.FONT_HERSHEY_PLAIN,1,(255,255,0),2)
            cv2.rectangle(return_investment, (x, y), (x + w, y + h), (0, 255, 0), 3)
        else:
            cv2.putText(return_investment,str(id)+ " "+str(tracker.getsp(id)),(x, y-15),cv2.FONT_HERSHEY_PLAIN, 1,(0, 0, 255),2)
            cv2.rectangle(return_investment, (x, y), (x + w, y + h), (0, 165, 255), 3)

        s = tracker.getsp(id)
        if (tracker.f[id] == 1 and s != 0):
            tracker.capture(return_investment, x, y, h, w, s, id)

    # DRAW_LINES TO TRACK THE VEHICLES

    #line_1
    frame_height, frame_width = return_investment.shape[:2]

    line_y_pos_1 = int(frame_height * 0.7)  # 90% from top
    line_y_pos_2 = int(frame_height * 0.75)  # 95% from top

    cv2.line(return_investment, (0, line_y_pos_1), (width, line_y_pos_1), (255, 0, 0), 2)
    cv2.line(return_investment, (0, line_y_pos_2), (width, line_y_pos_2), (255, 0, 0), 2)

    # line_2
    cv2.line(return_investment, (0, (line_y_pos_1-100)), (width, (line_y_pos_1-100)), (0, 0, 255), 2)
    cv2.line(return_investment, (0, (line_y_pos_1-75)), (width, (line_y_pos_1-75)), (0, 0, 255), 2)


    #DISPLAY
    cv2.imshow("SPEED TRACKER", return_investment)

    key = cv2.waitKey(w-10)
    if key==27:
        tracker.end()
        end=1
        break
if(end!=1):
    tracker.end()

cap.release()
cv2.destroyAllWindows()