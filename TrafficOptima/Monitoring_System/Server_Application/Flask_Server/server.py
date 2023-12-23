import jwt
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask import request, abort

from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Routes.Accident_Severity_Detection.ASD_routes import \
    init_asd_routes
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Routes.Emergency_vehicle_prioritization.EVP_Routes import \
    evp_routes
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Routes.Organization.Organization_Routes import \
    init_organizationRoutes
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Routes.Permission_And_Settings.Settings import \
    init_setting
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Routes.Permission_And_Settings.User import \
    init_permission_setting
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Routes.Plans_Prices.Plans_Prices_Routes import \
    init_palns_prices_routes
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Routes.Traffic_Light_System.Traffic_Light_System_Routes import \
    init_trafic_light_system_routes
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Routes.Violation_Detection.violation_detection import \
    init_violation_detection
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Utills.db import settings

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
app.config['UPLOAD_FOLDER'] = 'static/files'
app.config['SECRET_KEY'] = 'mysecretkey'

init_trafic_light_system_routes(app, "/traffic")
init_asd_routes(app, "/accident")
evp_routes(app, "/emergency")
init_violation_detection(app, "/violation")

init_organizationRoutes(app, bcrypt)
init_palns_prices_routes(app)
init_permission_setting(app, bcrypt)
init_setting(app)

@app.before_request
def before_request():
    if request.path.startswith('/violation') or request.path.startswith('/emergency') or request.path.startswith(
            '/accident') or request.path.startswith('/traffic'):
        token = request.headers.get('Authorization')
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload['user']['id']
        result = settings.find_one({'user_id': user_id}, sort=[('created_at', -1)])
        if request.path.startswith('/violation'):
            if 'Traffic Violation' not in result['settings_list']:
                abort(403)
        if request.path.startswith('/emergency'):
            if 'EV Prioritization' not in result['settings_list']:
                abort(403)
        if request.path.startswith('/accident'):
            if 'Accident Detection' not in result['settings_list']:
                abort(403)
        if request.path.startswith('/traffic'):
            if 'Traffic Optimization' not in result['settings_list']:
                abort(403)


if __name__ == "__main__":
    app.run(debug=True)
