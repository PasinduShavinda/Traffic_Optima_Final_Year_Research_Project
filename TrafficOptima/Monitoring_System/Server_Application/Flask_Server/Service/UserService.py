"""
------------------------------------------------------------------------------
 File: UserService.py
 Purpose: This file contains a script for Service to handle User Setting.
 Author: IT20122614
 Date: 2023-10-30
------------------------------------------------------------------------------
"""
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.db import users, organization
from bson import ObjectId


def create_new_user(organization_id, employee_no, email, password, permissions,organization_name):
    try:
        user_data = {
            'organization_id': organization_id,
            'employee_no': employee_no,
            'email': email,
            'password': password,
            'permissions': permissions,
            "organization_name":organization_name,
            "role":"user"
        }
        print(f"user_data: {user_data}")
        result = users.insert_one(user_data)
        return str(result.inserted_id)
    except Exception as e:
        print(f"Failed to create new user: {e}")


def check_email_is_exist(email):
    try:
        existing_email_user = users.find_one({'email': email})
        return existing_email_user is not None
    except Exception as e:
        print(f"Failed to check email: {e}")


def remove_user_by_id(user_id):
    try:
        result = users.delete_one({'_id': ObjectId(user_id)})
        return result.deleted_count
    except Exception as e:
        print(f"Failed to Remove user: {e}")


def update_user_permission(user_id, new_permissions):
    try:
        result = users.update_one({'_id': ObjectId(user_id)}, {'$set': {'permissions': new_permissions}})
        if result.modified_count == 0:
            return False
        return True
    except Exception as e:
        print(f"Failed to Update user: {e}")


def get_all_current_users():
    try:
        users_list = list(users.find())
        return users_list
    except Exception as e:
        print(f"Failed to Update user: {e}")


def get_user_by_id(user_id):
    try:
        users_list = users.find_one({'_id': ObjectId(user_id)})
        return users_list
    except Exception as e:
        print(f"Failed to Get user: {e}")


def update_user_password(user_id, new_password,new_fullname):
    try:
        result = users.update_one({'_id': ObjectId(user_id)}, {'$set': {'password': new_password ,'fullname': new_fullname}})
        if result.modified_count == 0:
            return False
        return True
    except Exception as e:
        print(f"Failed to Update user: {e}")

def create_new_org_admin(organization_id, employee_no, email, password, permissions,organization_name):
    try:
        user_data = {
            'organization_id': organization_id,
            'employee_no': employee_no,
            'email': email,
            'password': password,
            'permissions': permissions,
            "organization_name":organization_name,
            "role":"org_admin"
        }
        print(f"user_data: {user_data}")
        result = users.insert_one(user_data)
        return str(result.inserted_id)
    except Exception as e:
        print(f"Failed to create new user: {e}")


def get_organization_by_id(organization_id):
    try:
        users_list = users.find({'organization_id': organization_id})
        return users_list
    except Exception as e:
        print(f"Failed to Get user: {e}")
