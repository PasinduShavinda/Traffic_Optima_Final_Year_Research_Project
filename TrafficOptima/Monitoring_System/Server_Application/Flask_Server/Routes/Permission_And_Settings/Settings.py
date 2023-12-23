import json
from flask import Flask
from flask import Blueprint, request, jsonify
from bson import json_util
# from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Routes.Accident_Severity_Detection.ASD_routes import \
#     init_asd_routes
# from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Routes.Emergency_vehicle_prioritization.EVP_Routes import \
#     evp_routes
# from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Routes.Traffic_Light_System.Traffic_Light_System_Routes import \
#     init_trafic_light_system_routes
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Routes.Violation_Detection.violation_detection import \
    init_violation_detection
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Service.SettingsService import \
    create_new_setting_for_organization, update_organization_permission, get_settings_by_id, get_settings_by_user_id


def init_setting(app):
    @app.route('/new-setting', methods=['POST'])
    def create_setting_for_organization():
        try:
            data = request.get_json()
            organization_id = data.get('organization_id')
            settings_list = data.get('settings_list')
            user_id = data.get('user_id')
            setting_id = create_new_setting_for_organization(organization_id, settings_list, user_id)
            return jsonify({'message': 'New Setting created successfully', 'setting_id': setting_id}), 201
        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/update-settings-permissions/<string:organization_id>', methods=['PUT'])
    def update_organization_settings(organization_id):
        try:
            data = request.get_json()
            new_permissions = data.get('permissions')
            if update_organization_permission(organization_id, new_permissions):
                return jsonify({'message': 'Permissions updated successfully!'}), 200
            else:
                return jsonify({'error': 'User Id is not found'}), 404
        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/settingss', methods=['POST'])
    def get_settings_by_idss():
        try:
            data = request.get_json()
            settings_list = data.get('settings_list')
            print(f"{settings_list}")
            # result = get_settings_by_id(setting_id)
            if 'Traffic Violation' in settings_list:
                print("1")
                init_violation_detection(app)

            if 'Emergency Vehicle Prioritization' in settings_list:
                # evp_routes(app)
                print("2")
            if 'Accident Severity Detection' in settings_list:
                # init_asd_routes(app)
                print("3")
            if 'Traffic Optimization' in settings_list:
                # init_trafic_light_system_routes(app)
                print("4")
            # return jsonify({'result': result}), 200
        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/settings/<string:user_id>', methods=['GET'])
    def get_settings_by_ids(user_id):
        try:
            result = get_settings_by_user_id(user_id)
            print(f"result: {result}")
            return json.loads(json_util.dumps(result)), 200
        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500
