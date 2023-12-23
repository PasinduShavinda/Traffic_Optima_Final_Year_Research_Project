import json

from flask import Blueprint, request, jsonify

from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Routes.Organization.Organization_Routes import User
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Service.UserService import create_new_user, \
    check_email_is_exist, remove_user_by_id, update_user_permission, get_all_current_users, get_user_by_id, \
    update_user_password, create_new_org_admin, get_organization_by_id
from bson import json_util


def init_permission_setting(app,bcrypt):
    @app.route('/new-user', methods=['POST'])
    def create_user():
        try:
            data = request.get_json()
            organization_id = data.get('organization_id')
            employee_no = data.get('employee_no')
            email = data.get('email')
            password = data.get('password')
            organization_name = data.get('organization_name')
            # password = bcrypt.generate_password_hash( data.get('password')).decode('utf-8')
            permissions = data.get('permissions')

            user_id = create_new_user(organization_id, employee_no, email,password , permissions,organization_name)
            return jsonify({'message': 'New User created successfully', 'user_id': user_id}), 201
        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/check-email-exists', methods=['GET'])
    def check_email_is_exists():
        try:
            email = request.args.get('email')
            existing_email_user = check_email_is_exist(email)
            return jsonify({'existing': existing_email_user}), 200
        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/<string:user_id>', methods=['DELETE'])
    def remove_user_by_ids(user_id):
        try:
            response = remove_user_by_id(user_id)
            if response > 0:
                return jsonify({'message': 'User delete successfully'}), 200
            else:
                return jsonify({'error': 'User cannot find'}), 404
        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/update-permissions/<string:user_id>', methods=['PUT'])
    def update_user_permissions(user_id):
        try:

            data = request.get_json()
            new_permissions = data.get('permissions')
            if update_user_permission(user_id, new_permissions):
                return jsonify({'message': 'Permissions updated successfully!'}), 200
            else:
                return jsonify({'error': 'User Id is not found'}), 404
        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/users', methods=['GET'])
    def get_all_users():

        try:
            result = get_all_current_users()
            print(f"result: {result}")
            return json.loads(json_util.dumps(result)), 200
        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/user/<string:user_id>', methods=['GET'])
    def get_user_by_ids(user_id):
        try:
            result = get_user_by_id(user_id)
            print(f"result: {result}")
            return json.loads(json_util.dumps(result)), 200
        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/get_users_by_organization', methods=['POST'])
    def get_users_by_organization():
        try:
            request_data = request.get_json()
            if 'organization_name' in request_data:
                organization_name = request_data['organization_name']
                result = get_all_current_users()  # Assuming you have a function to fetch user data

                employee_nos = []

                for user in result:
                    if 'organization_name' in user and user['organization_name'] == organization_name:
                        employee_no = user.get('employee_no')
                        password = user.get('password')
                        if password is None and employee_no:
                            employee_nos.append(employee_no)

                return jsonify({'employee_nos': employee_nos}), 200

            return jsonify({'error': 'Organization name not provided in the request body'}), 400

        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/find_one_user_by_org_and_emp', methods=['POST'])
    def find_one_user_by_org_and_emp():
        try:
            request_data = request.get_json()
            if 'organization_name' in request_data and 'employee_no' in request_data:
                organization_name = request_data['organization_name']
                employee_no = request_data['employee_no']
                result = get_all_current_users()  # Assuming you have a function to fetch user data

                matching_user = None

                for user in result:
                    if 'organization_name' in user and user['organization_name'] == organization_name and user.get(
                            'employee_no') == employee_no:
                        matching_user = user
                        break  # Exit the loop when a matching user is found

                if matching_user:
                    return json.loads(json_util.dumps(matching_user)), 200
                else:
                    return jsonify({'message': 'User not found with the given criteria'}), 404

            return jsonify({'error': 'Both organization_name and employee_no are required in the request body'}), 400

        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/update-user/<string:user_id>', methods=['PUT'])
    def update_user_details(user_id):
        try:
            data = request.get_json()
            new_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
            Fullname =data.get('fullName')

            if update_user_password(user_id, new_password,Fullname):
                return jsonify({'message': 'User details updated successfully!'}), 200
            else:
                return jsonify({'error': 'User ID is not found'}), 404

        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/new-org-admin', methods=['POST'])
    def create_org_addmin():
        try:
            data = request.get_json()
            organization_id = data.get('organization_id')
            employee_no = data.get('employee_no')
            organization_name = data.get('organization_name')
            email = data.get('email')
            password = bcrypt.generate_password_hash( data.get('password')).decode('utf-8')
            permissions = data.get('permissions')

            user_id = create_new_org_admin(organization_id, employee_no, email, password, permissions,organization_name)
            return jsonify({'message': 'New User created successfully', 'user_id': user_id}), 201
        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/organization/<string:organization_id>', methods=['GET'])
    def get_organization_by_ids(organization_id):
        try:
            result = get_organization_by_id(organization_id)
            print(f"result: {result}")
            return json.loads(json_util.dumps(result)), 200
        except Exception as e:
            print(e)
            return jsonify({'error': 'Internal server error'}), 500


