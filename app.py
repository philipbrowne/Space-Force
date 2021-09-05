from flask import Flask, render_template, request, redirect, session, flash, jsonify, abort, send_from_directory, url_for, json, current_app as app
from models import connect_db, db, User, Score
import json
from forms import NewUserForm, UserLoginForm
from sqlalchemy.exc import IntegrityError
import os

app = Flask(__name__, static_url_path='',
            static_folder='static',
            template_folder='templates')

URI = os.environ.get('DATABASE_URL', 'postgresql:///spaceforce-db')
if URI.startswith("postgres://"):
    URI = URI.replace("postgres://", "postgresql://", 1)
app.config["SQLALCHEMY_DATABASE_URI"] = URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True
app.config["SECRET_KEY"] = os.environ.get(
    'SECRET_KEY', 'M8)\x92\xb6Gk\xeeR\xc7jr')
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
connect_db(app)


@app.route('/')
def index():
    """Landing Page"""
    return render_template('index.html')


@app.route('/favicon.ico')
def favicon():
    """Returns Favicon"""
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/static/assets/tilemaps/tilemap.json')
def get_json():
    """Route for Tilemap JSON"""
    return render_template('tilemap.json')


@app.route('/game')
def start_game():
    """Starts Game"""
    if 'username' not in session:
        flash('Please sign in first', 'danger')
        return redirect('/')
    username = session['username']
    user = User.query.filter(User.username == username).first()
    user.times_played += 1
    db.session.commit()
    return render_template('game.html', user=user)


@app.route('/users/<username>')
def get_user_info(username):
    """Provides information on current user"""
    if 'username' not in session:
        flash('Please sign in first', 'danger')
        return redirect('/')
    user = User.query.filter(User.username == username).first()
    if not user:
        abort(404)
    return render_template('user.html', user=user)


@app.route('/register', methods=['GET', 'POST'])
def register_new_user():
    """User Registration"""
    form = NewUserForm()
    if form.validate_on_submit():
        username = form.username.data
        password = User.register(username, form.password.data).password
        email = form.email.data
        new_user = User(username=username, password=password,
                        email=email)
        db.session.add(new_user)
        try:
            db.session.commit()
        except IntegrityError:
            form.username.errors = ['Sorry - this username or email address is already registered']
            form.email.errors = ['Sorry - this username or email address is already registered']
            return render_template('register.html', form=form)
        session['username'] = new_user.username
        flash(f'Welcome {new_user.username}!', 'success')
        return redirect(f'/users/{new_user.username}')
    else:
        return render_template('register.html', form=form)


@app.route('/login', methods=['GET', 'POST'])
def log_in():
    """Logs user into site"""
    form = UserLoginForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        user = User.authenticate(username, password)
        if user:
            flash(f'Welcome back, {user.username}!', 'success')
            session['username'] = user.username
            return redirect(f'/users/{user.username}')
        else:
            form.username.errors = ['Invalid Username/Password']
    return render_template('login.html', form=form)


@app.route('/logout')
def log_out_user():
    """Logs user out of site"""
    session.pop('username')
    flash('User logged out!', 'success')
    return redirect('/')


@app.route('/users/<username>/delete', methods=['POST'])
def delete_user(username):
    """Deletes user from database and site"""
    curr_user = User.query.filter(
        User.username == session.get('username')).first()
    user = User.query.filter(User.username == username).first()
    if session.get('username') != username:
        flash('Must be logged in as user to delete', 'danger')
        return redirect('/')
    else:
        deleted_user = User.query.filter(User.username == username).first()
        db.session.delete(deleted_user)
        db.session.commit()
        session.pop('username')
        flash('User deleted', 'success')
        return redirect('/')


@app.route('/rankings')
def get_high_scores():
    """Returns top scores from game sorted by shortest completion time"""
    scores = Score.query.order_by(Score.print_time).limit(10).all()
    return render_template('rankings.html', scores=scores)


@app.route('/wingame', methods=['POST'])
def get_score():
    """Sends information from finished game in JSON format, stores information in database"""
    curr_user = User.query.filter(
        User.username == session.get('username')).first()
    curr_user.times_played += 1
    curr_user.best_time = request.json.get('best_time')
    curr_user.personal_best = request.json.get('personal_best')
    curr_user.total_completions = request.json.get('total_completions')
    db.session.commit()
    completion_time = request.json.get('completion_time')
    print_time = request.json.get('print_time')
    new_score = Score(username=curr_user.username,
                      completion_time=completion_time, print_time=print_time)
    db.session.add(new_score)
    db.session.commit()
    return ''


@app.route('/users/<username>/details')
def get_details(username):
    """Gets details on current user in JSON format"""
    if 'username' in session:
        user = User.query.filter(
            User.username == session.get('username')).first()
        details = {
            'username': user.username,
            'email': user.email,
            'times_played': user.times_played,
            'total_completions': user.total_completions,
            'best_time': user.best_time,
            'personal_best': user.personal_best
        }
        return jsonify(details)
    else:
        abort(404)
