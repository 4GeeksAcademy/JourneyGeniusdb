import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Service, Message
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

@api.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.serialize() for product in products])

@api.route('/products', methods=['POST'])
def create_product():
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

@api.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    return jsonify([service.serialize() for service in services])

@api.route('/services', methods=['POST'])
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

# Criar uma nova mensagem
@api.route('/messages', methods=['POST'])
def create_message():
    data = request.get_json()

    # Verificar se o remetente e o destinatário existem
    sender = User.query.get(data['sender_id'])
    receiver = User.query.get(data['receiver_id'])

    if not sender or not receiver:
        return {"error": "sender or receiver does not exist"}, 400

    # Se a mensagem estiver associada a um produto ou serviço, verificar se eles existem
    product = Product.query.get(data.get('product_id')) if 'product_id' in data else None
    service = Service.query.get(data.get('service_id')) if 'service_id' in data else None

    if ('product_id' in data and not product) or ('service_id' in data and not service):
        return {"error": "product or service does not exist"}, 400

    # Criar a mensagem
    message = Message(sender_id=sender.id, receiver_id=receiver.id, text=data['text'], product=product, service=service)
    db.session.add(message)
    db.session.commit()

    return {"message": "message created successfully"}, 201

# Obter todas as mensagens de um usuário específico
@api.route('/users/<int:user_id>/messages', methods=['GET'])
def get_user_messages(user_id):
    user = User.query.get(user_id)

    if not user:
        return {"error": "user not found"}, 404

    sent_messages = [message.to_dict() for message in user.sent_messages]
    received_messages = [message.to_dict() for message in user.received_messages]

    return {"sent_messages": sent_messages, "received_messages": received_messages}, 200

# Obter uma mensagem específica
@api.route('/messages/<int:message_id>', methods=['GET'])
def get_message(message_id):
    message = Message.query.get(message_id)

    if not message:
        return {"error": "message not found"}, 404

    return {"message": message.to_dict()}, 200

# Atualizar uma mensagem
@api.route('/messages/<int:message_id>', methods=['PUT'])
def update_message(message_id):
    data = request.get_json()
    message = Message.query.get(message_id)

    if not message:
        return {"error": "message not found"}, 404

    # Atualizar o texto da mensagem
    if 'text' in data:
        message.text = data['text']

    db.session.commit()

    return {"message": "message updated successfully"}, 200

# Deletar uma mensagem
@api.route('/messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    message = Message.query.get(message_id)

    if not message:
        return {"error": "message not found"}, 404

    db.session.delete(message)
    db.session.commit()

    return {}, 204

# Criar um novo trade
@api.route('/trades', methods=['POST'])
def create_trade():
    data = request.get_json()

    # Verificar se o proponente, produtos e serviços existem
    proposer = User.query.get(data['proposer_id'])
    product_offered = Product.query.get(data.get('product_offered_id')) if 'product_offered_id' in data else None
    service_offered = Service.query.get(data.get('service_offered_id')) if 'service_offered_id' in data else None
    product_requested = Product.query.get(data.get('product_requested_id')) if 'product_requested_id' in data else None
    service_requested = Service.query.get(data.get('service_requested_id')) if 'service_requested_id' in data else None

    if not proposer or ('product_offered_id' in data and not product_offered) or ('service_offered_id' in data and not service_offered) or ('product_requested_id' in data and not product_requested) or ('service_requested_id' in data and not service_requested):
        return {"error": "proposer, product or service does not exist"}, 400

    # Criar o trade
    trade = Trade(proposer_id=proposer.id, product_offered=product_offered, service_offered=service_offered, product_requested=product_requested, service_requested=service_requested, status=data['status'])
    db.session.add(trade)
    db.session.commit()

    return {"message": "trade created successfully"}, 201

# Obter todos os trades de um usuário específico
@api.route('/users/<int:user_id>/trades', methods=['GET'])
def get_user_trades(user_id):
    user = User.query.get(user_id)

    if not user:
        return {"error": "user not found"}, 404

    proposed_trades = [trade.to_dict() for trade in user.proposed_trades]

    return {"proposed_trades": proposed_trades}, 200

# Obter um trade específico
@api.route('/trades/<int:trade_id>', methods=['GET'])
def get_trade(trade_id):
    trade = Trade.query.get(trade_id)

    if not trade:
        return {"error": "trade not found"}, 404

    return {"trade": trade.to_dict()}, 200

# Atualizar um trade
@api.route('/trades/<int:trade_id>', methods=['PUT'])
def update_trade(trade_id):
    data = request.get_json()
    trade = Trade.query.get(trade_id)

    if not trade:
        return {"error": "trade not found"}, 404

    # Atualizar o status do trade
    if 'status' in data:
        trade.status = data['status']

    db.session.commit()

    return {"message": "trade updated successfully"}, 200

# Deletar um trade
@api.route('/trades/<int:trade_id>', methods=['DELETE'])
def delete_trade(trade_id):
    trade = Trade.query.get(trade_id)

    if not trade:
        return {"error": "trade not found"}, 404

    db.session.delete(trade)
    db.session.commit()

    return {"message": "trade deleted successfully"}, 200