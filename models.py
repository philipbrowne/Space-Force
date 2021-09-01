from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime


db = SQLAlchemy()
bcrypt = Bcrypt()


def connect_db(app):
    """Connect to database"""
    db.app = app
    db.init_app(app)


class User(db.Model):
    """User Model"""
    __tablename__ = 'users'
    username = db.Column(db.String, primary_key=True, unique=True)
    password = db.Column(db.Text, nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    best_time = db.Column(db.Float)
    times_played = db.Column(db.Integer, default=0)
    total_completions = db.Column(db.Integer, default=0)
    personal_best = db.Column(db.String)

    @classmethod
    def register(cls, username, password):
        """Register usedr with hashed password and return user"""
        hashed = bcrypt.generate_password_hash(password)
        # Turn bytestring into normal (unicode utf8) string
        hashed_utf8 = hashed.decode('utf8')
        # Return instance of user with username and hashed password
        return cls(username=username, password=hashed_utf8)

    @classmethod
    def authenticate(cls, username, password):
        """Validate that user exists and password is correct

        Return user if valid; otherwise return False.
        """
        # Queries for unique username from database
        user = User.query.filter_by(username=username).first()
        # If valid user and if password check lines up with database hash
        if user and bcrypt.check_password_hash(user.password, password):
            # Return User instance
            return user
        else:
            return False


class Score(db.Model):
    __tablename__ = 'scores'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    timestamp = db.Column(db.DateTime(timezone=True),
                          default=datetime.now)
    completion_time = db.Column(db.Float, nullable=False)
    print_time = db.Column(db.String, nullable=False)
    username = db.Column(db.String(20), db.ForeignKey(
        'users.username', onupdate='CASCADE', ondelete='CASCADE'))

    @property
    def date(self):
        return self.timestamp.strftime("%a %b %-d %Y, %-I:%M %p")
