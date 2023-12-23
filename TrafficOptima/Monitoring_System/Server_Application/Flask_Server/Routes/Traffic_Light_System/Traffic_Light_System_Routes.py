"""
------------------------------------------------------------------------------
 File: Traffic_Light_System_Routes.py
 Purpose: This file contains Routes for traffic light system
 Author: IT20137700
 Date: 2023-10-30
------------------------------------------------------------------------------
"""

from flask import Flask, render_template, Response,jsonify,request,session
from flask_wtf import FlaskForm
from wtforms import FileField, SubmitField,StringField,DecimalRangeField,IntegerRangeField
from werkzeug.utils import secure_filename
from wtforms.validators import InputRequired,NumberRange
import os
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Generate_Frames import generate_frames
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Generate_Frames import generate_frames2
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Generate_Frames import generate_frames3
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Generate_Frames import generate_frames4
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Generate_Frames import my_dict
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Generate_Frames import circular_buffer1
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Generate_Frames import circular_buffer2
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Generate_Frames import circular_buffer3
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Generate_Frames import circular_buffer4
from flask import Flask, jsonify

from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Traffic_Algorithem import \
    control_traffic_lights


class UploadFileForm(FlaskForm):
    file_x = FileField("Video File X", validators=[InputRequired()])
    file_y = FileField("Video File Y", validators=[InputRequired()])
    file_z = FileField("Video File Z", validators=[InputRequired()])
    file_w = FileField("Video File W", validators=[InputRequired()])

    submit = SubmitField("Run")


def init_trafic_light_system_routes(app, startPoint):


    @app.route('/video_Lane01')
    def video_Lane01():
        path_x = '/Users/sugandhihansikakalansooriya/Desktop/Oct 30 /2023-228/TrafficOptima/Monitoring_System/Server_Application/Flask_Server/Routes/Traffic_Light_System/static/files/file1.mp4'
        frame = generate_frames(path_x)

        return Response(frame, mimetype='multipart/x-mixed-replace; boundary=frame')

    @app.route('/video_Lane02')
    def video_Lane02():
        path_y = '/Users/sugandhihansikakalansooriya/Desktop/Oct 30 /2023-228/TrafficOptima/Monitoring_System/Server_Application/Flask_Server/Routes/Traffic_Light_System/static/files/file2.mp4'
        frame2 = generate_frames2(path_y)
        return Response(frame2, mimetype='multipart/x-mixed-replace; boundary=frame')

    @app.route('/video_Lane03')
    def video_Lane03():
        path_z = '/Users/sugandhihansikakalansooriya/Desktop/Oct 30 /2023-228/TrafficOptima/Monitoring_System/Server_Application/Flask_Server/Routes/Traffic_Light_System/static/files/file3.mp4'
        frame3  = generate_frames3(path_z)
        return Response(frame3, mimetype='multipart/x-mixed-replace; boundary=frame')

    @app.route('/video_Lane04')
    def video_Lane04():
        path_w = '/Users/sugandhihansikakalansooriya/Desktop/Oct 30 /2023-228/TrafficOptima/Monitoring_System/Server_Application/Flask_Server/Routes/Traffic_Light_System/static/files/file4.mp4'
        frame4  = generate_frames4(path_w)
        return Response( frame4, mimetype='multipart/x-mixed-replace; boundary=frame')



    @app.route(startPoint+'/api/upload_videos', methods=['POST'])
    def upload_videos():
        try:
            uploaded_files = request.files.getlist('files')

            if len(uploaded_files) != 4:
                return jsonify({'error': 'Exactly four video files are required'}), 400

            paths = []

            for idx, file in enumerate(uploaded_files):
                if file.filename == '':
                    return jsonify({'error': f'No video selected for file {idx + 1}'}), 400

                file_path = os.path.join(
                    os.path.abspath(os.path.dirname(__file__)),
                    app.config['UPLOAD_FOLDER'],
                    secure_filename(file.filename)
                )

                file.save(file_path)
                paths.append(file_path)

                session[f'video_path_{idx + 1}'] = file_path
                print(f'video_path_{idx + 1}')

            return jsonify({'message': 'Videos uploaded successfully'}), 200

        except Exception as e:
            return jsonify({'error': 'An error occurred'}), 500

    @app.route(startPoint+'/get_numerical_value', methods=['GET'])
    def get_numerical_value():

        lane1 = my_dict["lane1"]
        lane2 = my_dict["lane2"]
        lane3 = my_dict["lane3"]
        lane4 = my_dict["lane4"]
        lane1_bus = my_dict["lane1_Bus"]
        lane2_bus = my_dict["lane2_Bus"]
        lane3_bus = my_dict["lane3_Bus"]
        lane4_bus = my_dict["lane4_Bus"]

        print(list(circular_buffer1))
        print(list(circular_buffer2))
        print(list(circular_buffer3))
        print(list(circular_buffer4))
        return jsonify({"lane1": lane1,
                        "lane2": lane2,
                        "lane3": lane3,
                        "lane4": lane4,
                        "buf1": list(circular_buffer1),
                        "buf2": list(circular_buffer2),
                        "buf3": list(circular_buffer3),
                        "buf4": list(circular_buffer4),
                        "lane1_bus":lane1_bus,
                        "lane2_bus":lane2_bus,
                        "lane3_bus":lane3_bus,
                        "lane4_bus":lane4_bus,
                        })

    @app.route(startPoint+'/trafficAlgorithem', methods=['POST'])
    def trafficAlgorithem():

        actions_generator = control_traffic_lights()
        actions = next(actions_generator)
        return jsonify(actions)
