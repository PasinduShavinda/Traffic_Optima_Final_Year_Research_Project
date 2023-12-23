"""
------------------------------------------------------------------------------
 File: SpeedTracker.py
 Purpose: This file contains a script for tracking Speed of moving object.
 Author: IT20122614
 Date: 2023-10-30
------------------------------------------------------------------------------
"""
import cv2
import math
import time
import numpy as np
import os
from pymongo import MongoClient



limit = 120  # km/hr

speed_record_folder_name = "SpeedRecord"

if not os.path.exists("./Functions/Violation_Detection/"+speed_record_folder_name):
    os.makedirs("./Functions/Violation_Detection/"+speed_record_folder_name)
    os.makedirs("./Functions/Violation_Detection/"+speed_record_folder_name+"//exceeded")

# write_recorded_speed_file
speed_record_text_file_location = "./Functions/Violation_Detection/"+speed_record_folder_name + "//speed_record.txt"
file = open(speed_record_text_file_location, "w")
file.write("ID \t SPEED\n------\t-------\n")
file.close()


def store_data_to_db(vehicle_id, speed, status, file_name):
    from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.db import violations
    data = {
        "vehicle_id": vehicle_id,
        "speed": speed,
        "status": status,
        "file_name": file_name
    }
    result = violations.insert_one(data)
    if result.acknowledged:
        return print(f"Data inserted successfully: {data}")
    else:
        return print(f"Failed to insert data=: {data}")

class Euclidean_distance_tracker:
    def __init__(self):
        # Store_the_center_positions_of_the_objects
        self.center_points = {}

        self.id_count = 0
        # self.start = 0
        # self.stop = 0
        self.et = 0
        self.s1 = np.zeros((1, 1000))
        self.s2 = np.zeros((1, 1000))
        self.s = np.zeros((1, 1000))
        self.f = np.zeros(1000)
        self.capf = np.zeros(1000)
        self.count = 0
        self.exceeded = 0

    def update(self, center_of_object):
        detected_object_id_list = []

        # Get_center_point_of_new_object
        for rect in center_of_object:
            x, y, w, h = rect
            cx = (x + x + w) // 2
            cy = (y + y + h) // 2

            # CHECK_IF_THE_OBJECT_IS_DETECTED_ALREADY
            is_same_object_is_tracked = False

            for id, pt in self.center_points.items():
                dist = math.hypot(cx - pt[0], cy - pt[1])

                if dist < 70:
                    self.center_points[id] = (cx, cy)
                    detected_object_id_list.append([x, y, w, h, id])
                    is_same_object_is_tracked = True

                    # START TIMER
                    if (y >= 410 and y <= 430):
                        self.s1[0, id] = time.time()

                    # STOP TIMER and FIND DIFFERENCE
                    if (y >= 235 and y <= 255):
                        self.s2[0, id] = time.time()
                        self.s[0, id] = self.s2[0, id] - self.s1[0, id]

                    # CAPTURE FLAG
                    if (y < 235):
                        self.f[id] = 1

            # NEW OBJECT DETECTION
            if is_same_object_is_tracked is False:
                self.center_points[self.id_count] = (cx, cy)
                detected_object_id_list.append([x, y, w, h, self.id_count])
                self.id_count += 1
                self.s[0, self.id_count] = 0
                self.s1[0, self.id_count] = 0
                self.s2[0, self.id_count] = 0

        # ASSIGN NEW ID to OBJECT
        new_center_points = {}
        for obj_bb_id in detected_object_id_list:
            _, _, _, _, object_id = obj_bb_id
            center = self.center_points[object_id]
            new_center_points[object_id] = center

        self.center_points = new_center_points.copy()
        return detected_object_id_list

    # SPEEED FUNCTION
    def getspeed(self, id):
        # 214.15
        if (self.s[0, id] != 0):

            s = 214.15 / self.s[0, id]
        else:
            s = 0

        return int(s)

    # SAVE VEHICLE DATA
    def capture(self, img, x, y, h, w, sp, id):
        if (self.capf[id] == 0):
            self.capf[id] = 1
            self.f[id] = 0
            crop_img = img[y - 5:y + h + 5, x - 5:x + w + 5]
            n = str(id) + "_speed_" + str(sp)
            file = "./Functions/Violation_Detection/"+speed_record_folder_name + '//' + n + '.jpg'
            file_name = n + '.jpg'
            # cv2.imwrite(file, crop_img)
            self.count += 1
            filet = open(speed_record_text_file_location, "a")
            if (sp > limit):
                file2 = "./Functions/Violation_Detection/"+speed_record_folder_name + '//exceeded//' + n + '.jpg'
                cv2.imwrite(file2, crop_img)
                filet.write(str(id) + " \t " + str(sp) + "<---exceeded\n")
                store_data_to_db(str(id), str(sp), "EXCEEDED", file_name)
                self.exceeded += 1
            else:
                # filet.write(str(id) + " \t " + str(sp) + "\n")
                # store_data_to_db(str(id), str(sp), "Not EXCEEDED", file_name)
                print("Not EXCEEDED")
            filet.close()

    # SPEED_LIMIT
    def limit(self):
        return limit

    # TEXT FILE SUMMARY
    def end(self):
        file = open(speed_record_text_file_location, "a")
        file.write("\n-------------\n")
        file.write("-------------\n")
        file.write("SUMMARY\n")
        file.write("-------------\n")
        file.write("Total Vehicles :\t" + str(self.count) + "\n")
        file.write("Exceeded speed limit :\t" + str(self.exceeded))
        file.close()
