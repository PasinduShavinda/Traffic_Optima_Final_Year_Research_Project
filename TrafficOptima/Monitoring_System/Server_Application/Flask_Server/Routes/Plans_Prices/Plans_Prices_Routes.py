"""
------------------------------------------------------------------------------
 File: Plans_Prices_Routes.py
 Purpose: This file contains routes related to Payment Plan and Prices
 Author: IT20140298
 Date: 2023-10-30
------------------------------------------------------------------------------
"""

from flask import request, jsonify
import stripe
from bson import ObjectId
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.db import db

stripe.api_key = 'sk_test_51O3WF2SIbnBLnqs7dyyYsAI0urZ5ERxenNfLNTbxVLNVbIID1spoGa87XA2c2s9xrSNs5hSSuODTzZAC30tu04hf00YU4ctA79'


def init_palns_prices_routes(app):
    @app.route('/pay', methods=['POST'])
    def pay():
        email = request.json.get('email', None)
        name = request.json.get('name', None)
        address = request.json.get('address', None)
        organizationId = request.json.get('organizationId', None)
        userId = request.json.get('userId', None)

        if not email or not name or not address:
            return 'You need to send an Email, Name, and Address!', 400

        customer = stripe.Customer.create(
            name=name,
            address={
                "line1": address,
                "postal_code": "98140",
                "city": "San Francisco",
                "state": "CA",
                "country": "US",
            },
        )

        intent = stripe.PaymentIntent.create(
            amount=50000,
            currency='usd',
            receipt_email=email,
            description="Traffic Optima Payments",
            customer=customer.id
        )

        upgradePlan(organizationId, userId)

        return {"client_secret": intent['client_secret']}, 200

    # FUNCTION FOR DOWNGRADE THE ORGANIZATION PLAN
    @app.route('/downgrade', methods=['POST'])
    def downGradePlan():
        organizationId = request.json.get('organizationId', None)
        data = {}
        code = 500
        try:
            # Update the 'isPlanFree' field to True
            res1 = db['organization'].update_one({"_id": ObjectId(organizationId)}, {"$set": {"isPlanFree": True}})
            res2 = db['users'].update_many({"organization_id": organizationId},
                                           {"$set": {"permissions": []}})
            if res1 and res2:
                message = "Plan Downgraded Successfully"
                status = "successful"
                code = 201
            else:
                message = "Downgrade failed"
                status = "fail"
                code = 404
        except Exception as ee:
            message = str(ee)
            status = "Error"

        return jsonify({"status": status, "message": message, 'data': data}), code


# FUNCTION FOR UPGRADE THE ORGANIZATION PLAN
def upgradePlan(organizationId, userId):
    data = {}
    code = 500
    try:
        # Update the 'isPlanFree' field to False
        res1 = db['organization'].update_one({"_id": ObjectId(organizationId)}, {"$set": {"isPlanFree": False}})

        res2 = db['users'].update_one(
            {"_id": ObjectId(userId)},
            {"$addToSet": {"permissions": "Permission and Settings"}}
        )

        if res1 and res2:
            message = "Plan Upgraded Successfully"
            status = "successful"
            code = 201

        else:
            message = "Upgrade failed"
            status = "fail"
            code = 404
    except Exception as ee:
        message = str(ee)
        status = "Error"

    return jsonify({"status": status, "message": message, 'data': data}), code
