"""
------------------------------------------------------------------------------
 File: SettingsService.py
 Purpose: This file contains a script for Service to handle System Setting.
 Author: IT20122614
 Date: 2023-10-30
------------------------------------------------------------------------------
"""
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.db import settings
from bson import ObjectId
from datetime import datetime


def create_new_setting_for_organization(organization_id, settings_list, user_id):
    try:
        current_datetime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        setting_data = {
            'organization_id': organization_id,
            'settings_list': settings_list,
            'user_id': user_id,
            'created_at': current_datetime
        }
        print(f"setting data: {setting_data}")
        result = settings.insert_one(setting_data)
        return str(result.inserted_id)
    except Exception as e:
        print(f"Failed to create new user: {e}")


def update_organization_permission(organization_id, new_permissions):
    try:
        result_organization = settings.find_one({'organization_id': organization_id})
        print(f"result organization: {result_organization['_id']}")
        settings_id = result_organization['_id']
        result = settings.update_one({'_id': ObjectId(settings_id)}, {'$set': {'settings_list': new_permissions}})
        if result.modified_count == 0:
            return False
        return True
    except Exception as e:
        print(f"Failed to create new user: {e}")


def get_settings_by_id(setting_id):
    try:
        users_list = settings.find_one({'_id': ObjectId(setting_id)})
        return users_list
    except Exception as e:
        print(f"Failed to Get user: {e}")


def get_settings_by_user_id(user_id):
    try:
        users_list = settings.find_one({'user_id': user_id}, sort=[('created_at', -1)])
        return users_list
    except Exception as e:
        print(f"Failed to Get user: {e}")
