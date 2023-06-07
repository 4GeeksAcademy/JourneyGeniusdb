import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Service
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from werkzeug.security import check_password_hash
from datetime import datetime
from dateutil import parser

api = Blueprint('api', __name__)

@api.route('/register', methods=['POST'])
def register():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    if not email:
        return jsonify({"msg": "Missing email parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400
    
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"msg": "A user with this email already exists"}), 400

    new_user = User()
    new_user.email = email
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201

@api.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    if not email:
        return jsonify({"msg": "Missing email parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)

@api.route('/protected', methods=['GET'])
@jwt_required
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@api.route('/products', methods=['POST'])
@jwt_required
def create_product():
    # Adicionar um novo produto
    current_user = get_jwt_identity()
    data = request.get_json()
    new_product = Product(user_id=current_user.id, 
                          name=data['name'], 
                          description=data['description'],
                          category=data['category'],
                          condition=data['condition'])
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.serialize()), 201

@api.route('/services', methods=['POST'])
@jwt_required
def create_service():
    # Adicionar um novo serviço
    current_user = get_jwt_identity()
    data = request.get_json()
    new_service = Service(user_id=current_user.id, 
                          name=data['name'], 
                          description=data['description'],
                          category=data['category'])
    db.session.add(new_service)
    db.session.commit()
    return jsonify(new_service.serialize()), 201