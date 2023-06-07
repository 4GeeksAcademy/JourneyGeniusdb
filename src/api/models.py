from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
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

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
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
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(120), nullable=False)
    condition = db.Column(db.String(120), nullable=False)
    estimated_value = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(120))

    user = db.relationship('User', backref='products')

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(120), nullable=False)
    estimated_value = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(120))

    user = db.relationship('User', backref='services')

class Trade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    offering_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiving_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'))
    offered_product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    offered_service_id = db.Column(db.Integer, db.ForeignKey('service.id'))
    status = db.Column(db.String(30), nullable=False)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'))
    content = db.Column(db.Text, nullable=False)

class Wishlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'))

class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'))

