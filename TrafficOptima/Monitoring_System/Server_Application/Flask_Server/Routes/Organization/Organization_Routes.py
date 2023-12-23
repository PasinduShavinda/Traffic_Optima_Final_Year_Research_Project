import certifi
import pymongo
from flask import Flask, jsonify, request, session
from bson import ObjectId
import jwt
from datetime import datetime, timedelta
from functools import wraps

secret = "mysecretkey"


from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.db import db

class User:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(User, cls).__new__(cls)
            cls._instance.user_data = None
        return cls._instance

    def set_user_data(self, user_data):
        self.user_data = user_data

    def get_user_data(self):
        return self.user_data


def tokenReq(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "Authorization" in request.headers:
            token = request.headers["Authorization"]
            try:
                jwt.decode(token, secret)
            except:
                return jsonify({"status": "fail", "message": "unauthorized"}), 401
            return f(*args, **kwargs)
        else:
            return jsonify({"status": "fail", "message": "unauthorized"}), 401

    return decorated


def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if "Authorization" in request.headers:
                token = request.headers["Authorization"]
                try:
                    payload = jwt.decode(token, secret)
                    user_id = payload['user']['id']
                    user = db['users'].find_one({"_id": ObjectId(user_id)})
                    if user and user.get('role') in allowed_roles:
                        return f(*args, **kwargs)
                except:
                    pass
            return jsonify({"status": "fail", "message": "Unauthorized"}), 401

        return decorated

    return decorator


def init_organizationRoutes(app, bcrypt):
    @app.route('/organization', methods=['GET', 'POST'])
    # @role_required(allowed_roles=["admin"])
    def OrganizationAdd():
        res = []
        code = 500
        status = "fail"
        message = ""
        try:
            if request.method == 'POST':
                organization_data = request.get_json()
                email_to_check = organization_data.get('email')

                # Check if the email already exists in the database
                existing_organization = db['organization'].find_one({'email': email_to_check})

                if existing_organization:
                    message = "Email already exists"
                    code = 400
                else:
                    res = db['organization'].insert_one(organization_data)
                    if res.acknowledged:
                        message = "Item saved"
                        status = 'successful'
                        code = 201
                        res = {"_id": f"{res.inserted_id}"}
                    else:
                        message = "Insert error"
                        res = 'fail'
                        code = 500
            else:
                for r in db['organization'].find().sort("_id", -1):
                    r['_id'] = str(r['_id'])
                    res.append(r)
                if res:
                    message = "Organizations retrieved"
                    status = 'successful'
                    code = 200
                else:
                    message = "No organizations found"
                    status = 'successful'
                    code = 200
        except Exception as ee:
            res = {"error": str(ee)}
        return jsonify({"status": status, 'data': res, "message": message}), code

    # delete
    @app.route('/organization/<organization_id>', methods=['DELETE'])
    #@role_required(allowed_roles=["admin"])
    def delete_one(organization_id):
        data = {}
        code = 500
        message = ""
        status = "fail"
        try:
            if request.method == 'DELETE':
                res = db['organization'].delete_one({"_id": ObjectId(organization_id)})
                if res:
                    message = "Delete successfully"
                    status = "successful"
                    code = 201
                else:
                    message = "Delete failed"
                    status = "fail"
                    code = 404
            else:
                message = "Delete Method failed"
                status = "fail"
                code = 404
        except Exception as ee:
            message = str(ee)
            status = "Error"

        return jsonify({"status": status, "message": message, 'data': data}), code

    # get one and update one
    @app.route('/getone/<organization_id>', methods=['GET', 'POST'])
    # @role_required(allowed_roles=["admin"])
    def by_id(organization_id):
        data = {}
        code = 500
        message = ""
        status = "fail"

        try:
            if request.method == 'POST':
                res = db['organization'].update_one({"_id": ObjectId(organization_id)}, {"$set": request.get_json()})
                if res:
                    message = "Updated successfully"
                    status = "successful"
                    code = 201
                else:
                    message = "Update failed"
                    status = "fail"
                    code = 404
            else:
                data = db['organization'].find_one({"_id": ObjectId(organization_id)})
                data['_id'] = str(data['_id'])
                if data:
                    message = "Item found"
                    status = "successful"
                    code = 200
                else:
                    message = "Update failed"
                    status = "fail"
                    code = 404
        except Exception as ee:
            message = str(ee)
            status = "Error"

        return jsonify({"status": status, "message": message, 'data': data}), code

    @app.route('/signup', methods=['POST'])
    def save_user():
        message = ""
        code = 500
        status = "fail"
        try:
            data = request.get_json()
            check = db['users'].find({"email": data['email']})
            if check.count() >= 1:
                message = "User with that email exists"
                code = 401
                status = "fail"
            else:
                data['password'] = bcrypt.generate_password_hash(data['password']).decode('utf-8')
                data['created'] = datetime.now()
                # Set the user's role (modify this logic as needed)
                data['role'] = data.get('role', 'user')

                res = db["users"].insert_one(data)
                if res.acknowledged:
                    status = "successful"
                    message = "User created successfully"
                    code = 201
        except Exception as ex:
            message = str(ex)
            status = "fail"
            code = 500
        return jsonify({'status': status, "message": message}), 200

    @app.route('/update/<organization_id>', methods=['POST'])
    # @role_required(allowed_roles=["admin"])
    def update_organization(organization_id):
        data = {}
        code = 500
        message = ""
        status = "fail"
        try:
            res = db['organization'].update_one({"_id": ObjectId(organization_id)}, {"$set": request.get_json()})
            if res:
                message = "Updated successfully"
                status = "successful"
                code = 201
            else:
                message = "Update failed"
                status = "fail"
                code = 404
        except Exception as ee:
            message = str(ee)
            status = "Error"

        return jsonify({"status": status, "message": message, 'data': data}), code

    @app.route('/login', methods=['POST'])
    def login():
        message = ""
        res_data = {}
        code = 500
        status = "fail"
        user_instance = User()
        try:
            data = request.get_json()
            user = db['users'].find_one({"email": data["email"]})

            if user:
                print("user available")
                user['_id'] = str(user['_id'])
                if user and bcrypt.check_password_hash(user['password'], data['password']):
                    time = datetime.utcnow() + timedelta(hours=24)
                    token = jwt.encode({
                        "user": {
                            "email": user['email'],
                            "id": user['_id'],
                        },
                        "exp": time
                    }, app.config['SECRET_KEY'])

                    del user['password']

                    message = "User authenticated"
                    code = 200
                    status = "successful"
                    res_data['token'] = token
                    res_data['user'] = user
                    session['user'] = user
                    user_instance.set_user_data(user)
                else:
                    message = "Wrong password"
                    code = 401
                    status = "fail"
            else:
                print("user not available")
                message = "Invalid login details"
                code = 401
                status = "fail"

        except Exception as ex:
            print("error")
            message = str(ex)
            code = 500
            status = "fail"
        return jsonify({'status': status, "data": res_data, "message": message}), code

    @app.route('/user-data', methods=['GET'])
    def get_user_data():
        user_instance = User()
        user_data = user_instance.get_user_data()

        if user_data:
            return jsonify(user_data)

        else:
            return jsonify({"message": "User data not available"})
