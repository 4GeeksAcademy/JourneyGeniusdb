import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Service, Message, Trade, ProductCategory, ProductSubcategory, ServiceCategory, ServiceSubcategory
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

    # Cria um token de acesso para o novo usuário logo após seu registro
    access_token = create_access_token(identity=email)

    # Criar um dicionário para representar o novo usuário
    user_dict = new_user.to_dict()
    
    return jsonify({"msg": "User created successfully", "user": user_dict, "access_token": access_token}), 201


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

    # removendo a senha do usuário
    user_dict = user.to_dict()
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token, user=user_dict)

@api.route('/profile', methods=['GET'])
@jwt_required()
def print_user_info():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user.to_dict()), 200

@api.route('/user/me', methods=['GET'])
@jwt_required()
def get_user_info():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user.to_dict()), 200

@api.route('/user/me', methods=['PUT'])
@jwt_required()
def update_user_info():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Missing JSON in request"}), 400

    for field in ["first_name", "last_name", "username"]:
        if field in data:
            setattr(user, field, data[field])
        elif getattr(user, field) is None:  # check if field is required and not set
            return jsonify({f"msg": f"Missing {field} parameter"}), 400

    optional_fields = ["gender", "birth_date", "phone", "location"]
    for field in optional_fields:
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()

    return jsonify({"msg": "User information updated successfully"}), 200


@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()
    return jsonify(logged_in_as=current_user.to_dict()), 200


@api.route('/products', methods=['GET'])
def get_products():
    category_id = request.args.get('category_id')
    subcategory_id = request.args.get('subcategory_id')
    
    query = Product.query
    
    if category_id:
        query = query.filter_by(category_id=category_id)
        
    if subcategory_id:
        query = query.filter_by(subcategory_id=subcategory_id)
    
    products = query.all()
    return jsonify([product.to_dict() for product in products])


@api.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Missing JSON in request"}), 400

    required_fields = ["name", "description", "category", "condition"]
    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing {field} parameter"}), 400

    category_id = data['category']
    subcategory_id = data['subcategory']

    category = ProductCategory.query.get(category_id)
    subcategory = ProductSubcategory.query.get(subcategory_id)

    if not category or not subcategory:
        return jsonify({"msg": "Category or Subcategory not found"}), 404

    new_product = Product(
        user_id=user.id,
        name=data['name'],
        description=data['description'],
        category_id=category.id,
        subcategory_id=subcategory.id,
        condition=data['condition'],
        estimated_value=data['estimated_value'],
        location=data['location']
    )

    db.session.add(new_product)
    db.session.commit()

    return jsonify(new_product.to_dict()), 201


@api.route('/product-categories', methods=['GET'])
def get_product_categories():
    categories = ProductCategory.query.all()
    return jsonify([category.to_dict() for category in categories]), 200

@api.route('/product-subcategories', methods=['GET'])
def get_product_subcategories():
    category_id = request.args.get('category_id')
    if category_id:
        subcategories = ProductSubcategory.query.filter_by(category_id=category_id).all()
    else:
        subcategories = ProductSubcategory.query.all()
    return jsonify([subcategory.to_dict() for subcategory in subcategories]), 200

@api.route('/product-categories/<int:category_id>/subcategories', methods=['GET'])
def get_product_subcategories_by_category(category_id):
    subcategories = ProductSubcategory.query.filter_by(category_id=category_id).all()
    return jsonify([subcategory.to_dict() for subcategory in subcategories]), 200

@api.route('/services', methods=['GET'])
def get_services():
    category_id = request.args.get('category_id')
    subcategory_id = request.args.get('subcategory_id')
    
    query = Service.query
    
    if category_id:
        query = query.filter_by(category_id=category_id)
        
    if subcategory_id:
        query = query.filter_by(subcategory_id=subcategory_id)
    
    services = query.all()
    return jsonify([service.to_dict() for service in services])


@api.route('/services', methods=['POST'])
@jwt_required()
def create_service():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Missing JSON in request"}), 400

    required_fields = ["name", "description", "category"]
    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing {field} parameter"}), 400

    category_id = data['category']
    subcategory_id = data['subcategory']

    category = ServiceCategory.query.get(category_id)
    subcategory = ServiceSubcategory.query.get(subcategory_id)

    if not category or not subcategory:
        return jsonify({"msg": "Category or Subcategory not found"}), 404

    new_service = Service(
        user_id=user.id,
        name=data['name'],
        description=data['description'],
        category_id=category.id,
        subcategory_id=subcategory.id,
        estimated_value=data['estimated_value'],
        location=data['location']
    )

    db.session.add(new_service)
    db.session.commit()

    return jsonify(new_service.to_dict()), 201


@api.route('/service-categories', methods=['GET'])
def get_service_categories():
    categories = ServiceCategory.query.all()
    return jsonify([category.to_dict() for category in categories]), 200

@api.route('/service-subcategories', methods=['GET'])
def get_service_subcategories():
    category_id = request.args.get('category_id')
    if category_id:
        subcategories = ServiceSubcategory.query.filter_by(category_id=category_id).all()
    else:
        subcategories = ServiceSubcategory.query.all()
    return jsonify([subcategory.to_dict() for subcategory in subcategories]), 200

@api.route('/service-categories/<int:category_id>/subcategories', methods=['GET'])
def get_service_subcategories_by_category(category_id):
    subcategories = ServiceSubcategory.query.filter_by(category_id=category_id).all()
    return jsonify([subcategory.to_dict() for subcategory in subcategories]), 200

@api.route('/items/search', methods=['GET'])
def search_items():
    name = request.args.get('name')
    
    if not name:
        return jsonify({"msg": "Missing name parameter"}), 400
    
    # Busca de produtos por nome
    products = Product.query.filter(Product.name.ilike(f'%{name}%')).all()
    # Busca de serviços por nome
    services = Service.query.filter(Service.name.ilike(f'%{name}%')).all()

    # Converter os produtos e serviços em dicionários
    products_list = [product.to_dict() for product in products]
    services_list = [service.to_dict() for service in services]

    # Retorna um objeto JSON com ambos, produtos e serviços
    return jsonify({"products": products_list, "services": services_list})

@api.route('/user/items', methods=['GET'])
@jwt_required()
def get_user_items():
    # Obtém o email do usuário a partir do token JWT.
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Buscando produtos e serviços cadastrados pelo usuário
    products = Product.query.filter_by(user_id=user.id).all()
    services = Service.query.filter_by(user_id=user.id).all()

    # Convertendo produtos e serviços em dicionários
    products_list = [product.to_dict() for product in products]
    services_list = [service.to_dict() for service in services]

    # Retornando um objeto JSON com produtos e serviços
    return jsonify({"products": products_list, "services": services_list})



# Criar uma nova wishlist
@api.route('/users/wishlist', methods=['POST'])
@jwt_required()
def create_wishlist():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    if not user:
        return {"error": "User not found"}, 404

    wishlist = Wishlist(user_id=user.id)
    db.session.add(wishlist)
    db.session.commit()

    return {"message": "Wishlist created successfully"}, 201

# Obter a wishlist de um usuário
@api.route('/users/wishlist', methods=['GET'])
@jwt_required()
def get_wishlist():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    if not user:
        return {"error": "User not found"}, 404

    wishlist = user.wishlist
    if wishlist is None:
        return {"error": "Wishlist not found"}, 404

    return {"wishlist": [item.to_dict() for item in wishlist.items]}, 200

# Adicionar um produto ou serviço aos favoritos de um usuário
@api.route('/users/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    data = request.get_json()
    product_id = data.get('product_id')
    service_id = data.get('service_id')

    if product_id is not None:
        product = Product.query.get(product_id)
        if product is None:
            return {"error": "Product not found"}, 404
        favorite = Favorite(user_id=user.id, product_id=product_id)
    elif service_id is not None:
        service = Service.query.get(service_id)
        if service is None:
            return {"error": "Service not found"}, 404
        favorite = Favorite(user_id=user.id, service_id=service_id)
    else:
        return {"error": "Product or service id is required"}, 400

    db.session.add(favorite)
    db.session.commit()

    return {"message": "Favorite added successfully"}, 201

# Obter os favoritos de um usuário
@api.route('/users/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    if not user:
        return {"error": "User not found"}, 404

    favorites = user.favorites
    return {"favorites": [favorite.to_dict() for favorite in favorites]}, 200


