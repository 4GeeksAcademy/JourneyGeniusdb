
import click
from api.models import db, User, ProductCategory, ProductSubcategory, ServiceCategory, ServiceSubcategory

def populate_product_categories_and_subcategories():
    categories_and_subcategories = {
        'Electronics': ['Computers', 'Televisions', 'Cameras and Photos', 'Cell Phones and Smartphones', 'Electronic Accessories'],
        'Home and Garden': ['Furniture', 'Appliances', 'Home Decor', 'Gardening', 'Home Improvements'],
        'Clothing and Accessories': ['Women\'s Clothing', 'Men\'s Clothing', 'Shoes', 'Accessories', 'Children\'s Clothing'],
        'Health and Beauty': ['Skin Care Products', 'Makeup', 'Perfumes and Fragrances', 'Hair Care', 'Health'],
        'Automotive': ['Vehicle Parts and Accessories', 'Automotive Tools and Equipment', 'Automotive Electronics'],
        'Books, Music and Movies': ['Books and Ebooks', 'Music', 'Movies and Series', 'Musical Instruments'],
        'Sports and Fitness': ['Sports Equipment and Accessories', 'Sportswear and Athletic Shoes', 'Fitness Equipment'],
        'Toys and Games': ['Toys', 'Games', 'Video Games and Consoles', 'Educational Toys'],
        'Babies and Children': ['Baby and Children Clothing', 'Baby and Children Furniture and Decor', 'Baby and Children Toys'],
        'Food and Drinks': ['Grocery', 'Alcoholic Beverages', 'Non-Alcoholic Beverages', 'Gourmet Products', 'Healthy Foods'],
        'Jewelry and Watches': ['Jewelry', 'Watches', 'Fashion Accessories'],
        'Travel': ['Luggage and Travel Accessories', 'Travel Accessories', 'Travel Packages'],
        'Business and Industrial': ['Office Equipment', 'Construction Materials', 'Industrial Equipment'],
        'Art and Entertainment': ['Art', 'Entertainment Memorabilia', 'Party Supplies'],
        'Animals and Pet Shop': ['Pet Food and Supplies', 'Pet Accessories', 'Pet Medications']

    }

    for category, subcategories in categories_and_subcategories.items():
        category_object = ProductCategory(name=category)
        db.session.add(category_object)
        db.session.commit()

        for subcategory in subcategories:
            subcategory_object = ProductSubcategory(name=subcategory, category_id=category_object.id)
            db.session.add(subcategory_object)

    db.session.commit()


def populate_service_categories_and_subcategories():
    service_categories_and_subcategories = {
        'Consulting': ['Business Consulting', 'IT Consulting', 'Legal Consulting'],
        'Healthcare': ['General Practitioner', 'Dentist', 'Physiotherapy', 'Psychology'],
        'Education': ['Tutoring', 'Language Learning', 'Coding Bootcamps', 'Art Classes'],
        'Financial Services': ['Accounting', 'Financial Advising', 'Tax Preparation'],
        'Real Estate': ['Buying & Selling', 'Rentals', 'Property Management'],
        'Food & Beverages': ['Catering', 'Meal Delivery', 'Personal Chef'],
        'Events & Entertainment': ['Event Planning', 'DJ Services', 'Wedding Planning'],
        'Travel & Tourism': ['Travel Agency', 'Tour Guiding', 'Accommodation Services'],
        'Automotive Services': ['Car Repair', 'Car Wash', 'Tire Services', 'Oil Change'],
        'Beauty & Wellness': ['Hairdressing', 'Massage Therapy', 'Spa Services'],
        'Sports & Recreation': ['Personal Training', 'Sports Coaching', 'Yoga Classes'],
        'Home Services': ['Cleaning', 'Landscaping', 'Home Repair', 'Pest Control'],
        'IT & Electronics': ['Computer Repair', 'Data Recovery', 'Mobile Phone Repair'],
        'Marketing & Advertising': ['SEO Services', 'Social Media Marketing', 'Content Creation'],
        'Transportation & Logistics': ['Courier Services', 'Moving Services', 'Storage Services']
    }

    for category, subcategories in service_categories_and_subcategories.items():
        category_object = ServiceCategory(name=category)
        db.session.add(category_object)
        db.session.commit()

        for subcategory in subcategories:
            subcategory_object = ServiceSubcategory(name=subcategory, category_id=category_object.id)
            db.session.add(subcategory_object)

    db.session.commit()

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    @app.cli.command("create-db")
    def create_db():
        db.create_all()
        if not ProductCategory.query.first():
            populate_product_categories_and_subcategories()
        if not ServiceCategory.query.first():
            populate_service_categories_and_subcategories()

    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_data(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

        ### Insert the code to populate others tables if needed