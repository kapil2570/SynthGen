from flask import Flask, request, jsonify, render_template, redirect, url_for
from api import *
from model import *
#import cors
from flask_restful import Api
from flask_cors import CORS
from sec import datastore
from config import DevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required
from flask_security import auth_required, roles_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)
db.init_app(app)
api.init_app(app)
app.security = Security(app, datastore)
app.app_context().push()
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400

    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404
    
    if not user.active:
        return jsonify({"message": "User Not Activated"}), 400
    

    if check_password_hash(user.password, data.get("password")):
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name, "username": user.username, "id": user.id})
    else:
        return jsonify({"message": "Wrong Password"}), 400
    
@app.post('/user-registration')
def user_registration():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    if not email:
        return jsonify({"message": "email not provided"}), 400
    if not password:
        return jsonify({"message": "password not provided"}), 400
    if not username:
        return jsonify({"message": "username not provided"}), 400
    if datastore.find_user(email=email):
        return jsonify({"message": "User Already Exists"}), 400
    else:
        datastore.create_user(
            username=username,
            email=email,
            password=generate_password_hash(password),
            roles=["Client"])
        db.session.commit()

        return jsonify({"message": "User Created Successfully"}), 201


if __name__ == "__main__":
    app.run(debug=True)

