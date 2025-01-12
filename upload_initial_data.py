from app import app
from sec import datastore
from model import db
from flask_security import hash_password
from werkzeug.security import generate_password_hash


with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="Admin", description="user is Admin")
    datastore.find_or_create_role(name="Client", description="user is Voter")
    db.session.commit()
    if not datastore.find_user(email="admin@gmail.com"):
        datastore.create_user(
            username="admin",
            email="admin@gmail.com",
            password= generate_password_hash("admin"),
            roles=["Admin"])
    if not datastore.find_user(email="voter1@gmail.com"):
        datastore.create_user(
            username="Client1",
            email="Client1@gmail.com",
            password=generate_password_hash("client1"),
            roles=["Client"])
    db.session.commit()


