from flask import Flask, request, jsonify, session, render_template
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
import json
import pandas as pd
import plotly.graph_objects as go
import plotly.utils
from functools import wraps
from flask import make_response
import csv
from io import StringIO
import base64
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

app = Flask(__name__)
app.config['SECRET_KEY'] = 'telkom-family-secret-key-2024'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../data/app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Database Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'parent' or 'student'
    parent_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    children = db.relationship('User', backref='parent', remote_side=[id])
    rules = db.relationship('Rule', backref='user', lazy=True)
    sessions = db.relationship('Session', backref='user', lazy=True)
    reports = db.relationship('Report', backref='user', lazy=True)

class Rule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    website_url = db.Column(db.String(500), nullable=False)
    is_allowed = db.Column(db.Boolean, default=True)
    study_mode = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    website_url = db.Column(db.String(500), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=True)
    duration_minutes = db.Column(db.Integer, default=0)
    is_study_time = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    week_start = db.Column(db.Date, nullable=False)
    total_study_time = db.Column(db.Integer, default=0)  # in minutes
    total_distraction_time = db.Column(db.Integer, default=0)  # in minutes
    most_visited_sites = db.Column(db.Text)  # JSON string
    study_efficiency = db.Column(db.Float, default=0.0)  # percentage
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated or current_user.role != role:
                return jsonify({'error': 'Access denied'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Authentication Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'student')
    parent_id = data.get('parent_id')
    
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
        role=role,
        parent_id=parent_id
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully', 'user_id': user.id}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    
    if user and check_password_hash(user.password_hash, password):
        login_user(user)
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'role': user.role,
                'parent_id': user.parent_id
            }
        }), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

# Parent Routes
@app.route('/api/parent/children', methods=['GET'])
@login_required
@role_required('parent')
def get_children():
    children = User.query.filter_by(parent_id=current_user.id).all()
    return jsonify([{
        'id': child.id,
        'username': child.username,
        'email': child.email,
        'created_at': child.created_at.isoformat()
    } for child in children]), 200

@app.route('/api/parent/rules', methods=['GET'])
@login_required
@role_required('parent')
def get_rules():
    child_id = request.args.get('child_id')
    if child_id:
        rules = Rule.query.filter_by(user_id=child_id).all()
    else:
        # Get rules for all children
        child_ids = [child.id for child in current_user.children]
        rules = Rule.query.filter(Rule.user_id.in_(child_ids)).all()
    
    return jsonify([{
        'id': rule.id,
        'user_id': rule.user_id,
        'website_url': rule.website_url,
        'is_allowed': rule.is_allowed,
        'study_mode': rule.study_mode,
        'created_at': rule.created_at.isoformat()
    } for rule in rules]), 200

@app.route('/api/parent/rules', methods=['POST'])
@login_required
@role_required('parent')
def create_rule():
    data = request.get_json()
    child_id = data.get('child_id')
    
    # Verify child belongs to current parent
    child = User.query.filter_by(id=child_id, parent_id=current_user.id).first()
    if not child:
        return jsonify({'error': 'Child not found'}), 404
    
    rule = Rule(
        user_id=child_id,
        website_url=data.get('website_url'),
        is_allowed=data.get('is_allowed', True),
        study_mode=data.get('study_mode', False)
    )
    
    db.session.add(rule)
    db.session.commit()
    
    return jsonify({'message': 'Rule created successfully', 'rule_id': rule.id}), 201

@app.route('/api/parent/rules/<int:rule_id>', methods=['DELETE'])
@login_required
@role_required('parent')
def delete_rule(rule_id):
    rule = Rule.query.get(rule_id)
    if not rule:
        return jsonify({'error': 'Rule not found'}), 404
    
    # Verify rule belongs to a child of current parent
    child = User.query.filter_by(id=rule.user_id, parent_id=current_user.id).first()
    if not child:
        return jsonify({'error': 'Access denied'}), 403
    
    db.session.delete(rule)
    db.session.commit()
    
    return jsonify({'message': 'Rule deleted successfully'}), 200

@app.route('/api/parent/analytics', methods=['GET'])
@login_required
@role_required('parent')
def get_analytics():
    child_id = request.args.get('child_id')
    days = int(request.args.get('days', 7))
    
    if child_id:
        # Verify child belongs to current parent
        child = User.query.filter_by(id=child_id, parent_id=current_user.id).first()
        if not child:
            return jsonify({'error': 'Child not found'}), 404
        user_ids = [child_id]
    else:
        user_ids = [child.id for child in current_user.children]
    
    # Get sessions from the last N days
    start_date = datetime.utcnow() - timedelta(days=days)
    sessions = Session.query.filter(
        Session.user_id.in_(user_ids),
        Session.start_time >= start_date
    ).all()
    
    # Calculate analytics
    total_study_time = sum(s.duration_minutes for s in sessions if s.is_study_time)
    total_distraction_time = sum(s.duration_minutes for s in sessions if not s.is_study_time)
    total_time = total_study_time + total_distraction_time
    
    # Most visited sites
    site_usage = {}
    for session in sessions:
        site = session.website_url
        if site not in site_usage:
            site_usage[site] = 0
        site_usage[site] += session.duration_minutes
    
    most_visited = sorted(site_usage.items(), key=lambda x: x[1], reverse=True)[:5]
    
    # Study efficiency
    study_efficiency = (total_study_time / total_time * 100) if total_time > 0 else 0
    
    # Generate charts
    charts = generate_analytics_charts(sessions, most_visited)
    
    return jsonify({
        'total_study_time': total_study_time,
        'total_distraction_time': total_distraction_time,
        'total_time': total_time,
        'study_efficiency': round(study_efficiency, 2),
        'most_visited_sites': most_visited,
        'charts': charts,
        'ai_suggestion': get_ai_suggestion(study_efficiency, total_distraction_time, total_time)
    }), 200

@app.route('/api/parent/export/csv', methods=['GET'])
@login_required
@role_required('parent')
def export_csv():
    child_id = request.args.get('child_id')
    days = int(request.args.get('days', 7))
    
    if child_id:
        child = User.query.filter_by(id=child_id, parent_id=current_user.id).first()
        if not child:
            return jsonify({'error': 'Child not found'}), 404
        user_ids = [child_id]
    else:
        user_ids = [child.id for child in current_user.children]
    
    # Get sessions data
    start_date = datetime.utcnow() - timedelta(days=days)
    sessions = Session.query.filter(
        Session.user_id.in_(user_ids),
        Session.start_time >= start_date
    ).all()
    
    # Create CSV
    output = StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow(['Date', 'Website', 'Start Time', 'End Time', 'Duration (minutes)', 'Study Time', 'User'])
    
    # Write data
    for session in sessions:
        user = User.query.get(session.user_id)
        writer.writerow([
            session.start_time.date(),
            session.website_url,
            session.start_time.strftime('%H:%M:%S'),
            session.end_time.strftime('%H:%M:%S') if session.end_time else 'N/A',
            session.duration_minutes,
            'Yes' if session.is_study_time else 'No',
            user.username
        ])
    
    # Create response
    output.seek(0)
    response = make_response(output.getvalue())
    response.headers['Content-Type'] = 'text/csv'
    response.headers['Content-Disposition'] = f'attachment; filename=family_usage_report_{datetime.now().strftime("%Y%m%d")}.csv'
    
    return response

@app.route('/api/parent/export/pdf', methods=['GET'])
@login_required
@role_required('parent')
def export_pdf():
    child_id = request.args.get('child_id')
    days = int(request.args.get('days', 7))
    
    if child_id:
        child = User.query.filter_by(id=child_id, parent_id=current_user.id).first()
        if not child:
            return jsonify({'error': 'Child not found'}), 404
        user_ids = [child_id]
        child_name = child.username
    else:
        user_ids = [child.id for child in current_user.children]
        child_name = "All Children"
    
    # Get analytics data
    start_date = datetime.utcnow() - timedelta(days=days)
    sessions = Session.query.filter(
        Session.user_id.in_(user_ids),
        Session.start_time >= start_date
    ).all()
    
    # Calculate analytics
    total_study_time = sum(s.duration_minutes for s in sessions if s.is_study_time)
    total_distraction_time = sum(s.duration_minutes for s in sessions if not s.is_study_time)
    total_time = total_study_time + total_distraction_time
    study_efficiency = (total_study_time / total_time * 100) if total_time > 0 else 0
    
    # Create PDF
    buffer = StringIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title = Paragraph("Telkom Family Usage Report", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 12))
    
    # Report details
    details = f"""
    <b>Report Period:</b> Last {days} days<br/>
    <b>Child:</b> {child_name}<br/>
    <b>Generated:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}<br/>
    """
    story.append(Paragraph(details, styles['Normal']))
    story.append(Spacer(1, 20))
    
    # Summary table
    summary_data = [
        ['Metric', 'Value'],
        ['Total Study Time', f'{total_study_time} minutes'],
        ['Total Distraction Time', f'{total_distraction_time} minutes'],
        ['Total Time', f'{total_time} minutes'],
        ['Study Efficiency', f'{study_efficiency:.1f}%']
    ]
    
    summary_table = Table(summary_data)
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.blue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    story.append(summary_table)
    story.append(Spacer(1, 20))
    
    # AI Recommendation
    ai_suggestion = get_ai_suggestion(study_efficiency, total_distraction_time, total_time)
    recommendation = Paragraph(f"<b>AI Recommendation:</b><br/>{ai_suggestion}", styles['Normal'])
    story.append(recommendation)
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    
    # Create response
    response = make_response(buffer.getvalue())
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename=family_report_{datetime.now().strftime("%Y%m%d")}.pdf'
    
    return response

def generate_analytics_charts(sessions, most_visited):
    charts = {}
    
    # Time distribution pie chart
    study_time = sum(s.duration_minutes for s in sessions if s.is_study_time)
    distraction_time = sum(s.duration_minutes for s in sessions if not s.is_study_time)
    
    fig_pie = go.Figure(data=[go.Pie(
        labels=['Study Time', 'Distraction Time'],
        values=[study_time, distraction_time],
        marker_colors=['#0073CF', '#FF6B6B']
    )])
    fig_pie.update_layout(
        title="Time Distribution",
        font=dict(family="Arial, sans-serif", size=12),
        margin=dict(t=50, b=50, l=50, r=50)
    )
    charts['time_distribution'] = json.dumps(fig_pie, cls=plotly.utils.PlotlyJSONEncoder)
    
    # Most visited sites bar chart
    if most_visited:
        sites = [site[0][:20] + '...' if len(site[0]) > 20 else site[0] for site in most_visited]
        times = [site[1] for site in most_visited]
        
        fig_bar = go.Figure(data=[go.Bar(
            x=sites,
            y=times,
            marker_color='#0073CF'
        )])
        fig_bar.update_layout(
            title="Most Visited Sites",
            xaxis_title="Website",
            yaxis_title="Time (minutes)",
            font=dict(family="Arial, sans-serif", size=12),
            margin=dict(t=50, b=50, l=50, r=50)
        )
        charts['most_visited'] = json.dumps(fig_bar, cls=plotly.utils.PlotlyJSONEncoder)
    
    return charts

def get_ai_suggestion(study_efficiency, distraction_time, total_time):
    if study_efficiency < 50:
        return "Consider enabling stricter study mode. Your child is spending more time on non-educational content."
    elif study_efficiency < 70:
        return "Good progress! Consider adding more educational websites to the whitelist."
    else:
        return "Excellent! Your child is maintaining a healthy balance between study and leisure time."

# Student Routes
@app.route('/api/student/sessions', methods=['POST'])
@login_required
@role_required('student')
def create_session():
    data = request.get_json()
    website_url = data.get('website_url')
    start_time = datetime.fromisoformat(data.get('start_time'))
    
    # Check if website is allowed
    rule = Rule.query.filter_by(user_id=current_user.id, website_url=website_url).first()
    is_allowed = rule.is_allowed if rule else True
    is_study_time = rule.study_mode if rule else False
    
    session = Session(
        user_id=current_user.id,
        website_url=website_url,
        start_time=start_time,
        is_study_time=is_study_time
    )
    
    db.session.add(session)
    db.session.commit()
    
    return jsonify({
        'message': 'Session created',
        'session_id': session.id,
        'is_allowed': is_allowed,
        'is_study_time': is_study_time
    }), 201

@app.route('/api/student/sessions/<int:session_id>', methods=['PUT'])
@login_required
@role_required('student')
def end_session(session_id):
    session = Session.query.get(session_id)
    if not session or session.user_id != current_user.id:
        return jsonify({'error': 'Session not found'}), 404
    
    end_time = datetime.fromisoformat(request.get_json().get('end_time'))
    session.end_time = end_time
    session.duration_minutes = int((end_time - session.start_time).total_seconds() / 60)
    
    db.session.commit()
    
    return jsonify({'message': 'Session ended successfully'}), 200

@app.route('/api/student/rules', methods=['GET'])
@login_required
@role_required('student')
def get_student_rules():
    rules = Rule.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': rule.id,
        'website_url': rule.website_url,
        'is_allowed': rule.is_allowed,
        'study_mode': rule.study_mode
    } for rule in rules]), 200

# Initialize database
@app.before_first_request
def create_tables():
    db.create_all()
    
    # Create default parent user if none exists
    if not User.query.filter_by(role='parent').first():
        parent = User(
            username='parent',
            email='parent@telkom.co.za',
            password_hash=generate_password_hash('password123'),
            role='parent'
        )
        db.session.add(parent)
        db.session.commit()
        
        # Create default student user
        student = User(
            username='student',
            email='student@telkom.co.za',
            password_hash=generate_password_hash('password123'),
            role='student',
            parent_id=parent.id
        )
        db.session.add(student)
        db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)