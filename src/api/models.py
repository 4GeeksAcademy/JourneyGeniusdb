from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    username = db.Column(db.String(120))
    gender = db.Column(db.String(120))
    birth_date = db.Column(db.Date)
    phone = db.Column(db.String(120))
    location = db.Column(db.String(120))

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "username": self.username,
            "gender": self.gender,
            "birth_date": self.birth_date.isoformat() if self.birth_date else None,
            "phone": self.phone,
            "location": self.location
        }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Product(db.Model):
    __tablename__ = 'product'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('product_category.id'))  # nova coluna
    subcategory_id = db.Column(db.Integer, db.ForeignKey('product_subcategory.id'))  # nova coluna
    condition = db.Column(db.String(120), nullable=False)
    estimated_value = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(120))

    user = db.relationship('User', backref='products')
    category = db.relationship('ProductCategory', backref='products')  # nova relação
    subcategory = db.relationship('ProductSubcategory', backref='products')  # nova relação

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "description": self.description,
            "category": self.category.to_dict() if self.category else None,
            "subcategory": self.subcategory.to_dict() if self.subcategory else None,
            "condition": self.condition,
            "estimated_value": self.estimated_value,
            "location": self.location
        }

class ProductCategory(db.Model):
    __tablename__ = 'product_category'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    subcategories = db.relationship('ProductSubcategory', backref='product_category')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'subcategories': [subcategory.to_dict() for subcategory in self.subcategories]
        }
        
class ProductSubcategory(db.Model):
    __tablename__ = 'product_subcategory'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('product_category.id'))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category_id': self.category_id
        }


class Service(db.Model):
    __tablename__ = 'service'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('service_categories.id'))  # nova coluna
    subcategory_id = db.Column(db.Integer, db.ForeignKey('service_subcategories.id'))  # nova coluna
    estimated_value = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(120))

    user = db.relationship('User', backref='services')
    category = db.relationship('ServiceCategory', backref='services')  # nova relação
    subcategory = db.relationship('ServiceSubcategory', backref='services')  # nova relação

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "description": self.description,
            "category": self.category.to_dict() if self.category else None,
            "subcategory": self.subcategory.to_dict() if self.subcategory else None,
            "estimated_value": self.estimated_value,
            "location": self.location
        }

class ServiceCategory(db.Model):
    __tablename__ = 'service_categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    subcategories = db.relationship('ServiceSubcategory', backref='category', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "subcategories": [subcategory.to_dict() for subcategory in self.subcategories]
        }


class ServiceSubcategory(db.Model):
    __tablename__ = 'service_subcategories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('service_categories.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category_id": self.category_id
        }

class Trade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    sender_product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    receiver_product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    sender_service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=True)
    receiver_service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=True)
    message = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(20), nullable=False)

    sender = db.relationship('User', foreign_keys=[sender_id])
    receiver = db.relationship('User', foreign_keys=[receiver_id])
    sender_product = db.relationship('Product', foreign_keys=[sender_product_id])
    receiver_product = db.relationship('Product', foreign_keys=[receiver_product_id])
    sender_service = db.relationship('Service', foreign_keys=[sender_service_id])
    receiver_service = db.relationship('Service', foreign_keys=[receiver_service_id])


class Message(db.Model):
    __tablename__ = 'message'

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'))
    content = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "product_id": self.product_id,
            "service_id": self.service_id,
            "content": self.content
        }


class Wishlist(db.Model):
    __tablename__ = 'wishlist'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "service_id": self.service_id
        }


class Favorite(db.Model):
    __tablename__ = 'favorite'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "service_id": self.service_id
        }
