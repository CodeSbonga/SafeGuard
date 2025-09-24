# Telkom Family Dashboard

A comprehensive parental control and study management system built with Flask backend and React frontend, designed to look and feel exactly like Telkom's official portal.

## Features

### 🏠 Telkom Dashboard Clone
- Exact replication of Telkom's design language, colors, and UI components
- Professional Telkom blue (#0073CF) theme with white accents
- Responsive design for desktop and mobile devices
- Clean, modern interface matching Telkom's brand standards

### 👨‍👩‍👧‍👦 myFamily Parental Control
- **Whitelist Management**: Add/remove allowed websites and applications
- **Study Mode**: Toggle ON/OFF to track study hours for each child device
- **Usage Tracking**: Real-time monitoring of allowed vs. disallowed activities
- **Analytics Dashboard**: Comprehensive reports with charts and insights
- **AI Recommendations**: Intelligent suggestions based on usage patterns

### 🎮 Educational Game Zone
- **Memory Match**: Card matching game to improve memory skills
- **Snake & Ladders**: Classic board game with educational elements
- **Math Challenge**: Timed math problems with scoring system
- **Word Builder**: Word formation game using given letters
- Child-friendly, engaging interface with rewards system

### 📊 Analytics & Reporting
- Real-time usage statistics with interactive charts
- Study efficiency tracking and progress monitoring
- Weekly reports with detailed insights
- Export functionality for CSV/PDF reports
- AI-powered recommendations for better digital wellness

## System Architecture

### Backend (Flask)
- **Framework**: Python Flask with REST API
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: Flask-Login with role-based access (Parent/Student)
- **Analytics**: Pandas + Plotly for data visualization
- **Models**: Users, Rules, Sessions, Reports

### Frontend (React)
- **Framework**: React 18 with React Router
- **Styling**: Tailwind CSS with custom Telkom theme
- **Charts**: React-Plotly.js for interactive visualizations
- **State Management**: React Context API
- **Responsive**: Mobile-first design approach

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: User email address
- `password_hash`: Encrypted password
- `role`: 'parent' or 'student'
- `parent_id`: Foreign key to parent user
- `created_at`: Account creation timestamp

### Rules Table
- `id`: Primary key
- `user_id`: Foreign key to user
- `website_url`: Website URL to control
- `is_allowed`: Boolean for allow/block
- `study_mode`: Boolean for study time tracking
- `created_at`: Rule creation timestamp

### Sessions Table
- `id`: Primary key
- `user_id`: Foreign key to user
- `website_url`: Website being accessed
- `start_time`: Session start timestamp
- `end_time`: Session end timestamp
- `duration_minutes`: Session duration
- `is_study_time`: Boolean for study classification
- `created_at`: Session creation timestamp

### Reports Table
- `id`: Primary key
- `user_id`: Foreign key to user
- `week_start`: Week start date
- `total_study_time`: Total study minutes
- `total_distraction_time`: Total distraction minutes
- `most_visited_sites`: JSON of top sites
- `study_efficiency`: Efficiency percentage
- `created_at`: Report creation timestamp

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Initialize the database:
```bash
python app.py
```

5. Start the Flask server:
```bash
flask run --host=0.0.0.0 --port=5000
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

### VS Code Live Server Setup

For quick local testing without React build process:

1. Install Live Server extension in VS Code
2. Right-click on `frontend/public/index.html`
3. Select "Open with Live Server"
4. The app will open in your browser

## Usage

### Demo Credentials

**Parent Account:**
- Username: `parent`
- Password: `password123`

**Student Account:**
- Username: `student`
- Password: `password123`

### Getting Started

1. **Login**: Use the demo credentials to access the system
2. **Parent Dashboard**: Access myFamily features for parental controls
3. **Student Dashboard**: View allowed websites and start study sessions
4. **Game Zone**: Play educational games and earn rewards
5. **Analytics**: Monitor usage patterns and study efficiency

### Parent Features

1. **Add Children**: Register student accounts linked to your parent account
2. **Create Rules**: Set website whitelists and study mode preferences
3. **Monitor Usage**: View real-time analytics and usage reports
4. **AI Insights**: Get recommendations for better digital wellness
5. **Export Reports**: Download CSV/PDF reports for offline analysis

### Student Features

1. **View Rules**: See which websites are allowed or blocked
2. **Study Mode**: Access educational content with time tracking
3. **Game Zone**: Play fun educational games during break time
4. **Progress Tracking**: Monitor your study time and achievements

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Parent Endpoints
- `GET /api/parent/children` - Get all children
- `GET /api/parent/rules` - Get rules for children
- `POST /api/parent/rules` - Create new rule
- `DELETE /api/parent/rules/<id>` - Delete rule
- `GET /api/parent/analytics` - Get usage analytics

### Student Endpoints
- `GET /api/student/rules` - Get student's rules
- `POST /api/student/sessions` - Start new session
- `PUT /api/student/sessions/<id>` - End session

## Customization

### Styling
The app uses Tailwind CSS with custom Telkom theme colors:
- Primary: `#0073CF` (Telkom Blue)
- Secondary: `#0056A3` (Telkom Dark Blue)
- Accent: `#E6F3FF` (Telkom Light Blue)

### Adding New Games
1. Create a new game component in `GameZone.js`
2. Add the game to the `games` array
3. Implement the game logic with score tracking
4. Add the game to the game selection menu

### Extending Analytics
1. Add new fields to the database models
2. Update the analytics API endpoints
3. Create new chart components in the frontend
4. Add export functionality for new data types

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure SQLite database file exists in `/data/app.db`
   - Check file permissions for database access

2. **CORS Issues**
   - Verify backend is running on port 5000
   - Check API_BASE_URL in frontend services

3. **Authentication Problems**
   - Clear browser localStorage
   - Restart both backend and frontend servers

4. **Chart Display Issues**
   - Ensure Plotly.js is properly installed
   - Check browser console for JavaScript errors

### Performance Optimization

1. **Database Indexing**: Add indexes for frequently queried fields
2. **Caching**: Implement Redis for session management
3. **CDN**: Use CDN for static assets in production
4. **Compression**: Enable gzip compression for API responses

## Security Considerations

1. **Password Hashing**: Uses Werkzeug's secure password hashing
2. **Session Management**: Flask-Login handles secure sessions
3. **Input Validation**: All user inputs are validated and sanitized
4. **CORS Protection**: Configured for specific origins only
5. **SQL Injection**: SQLAlchemy ORM prevents SQL injection attacks

## Deployment

### Production Setup

1. **Environment Variables**:
   ```bash
   export FLASK_ENV=production
   export SECRET_KEY=your-secret-key
   export DATABASE_URL=your-database-url
   ```

2. **Database Migration**:
   ```bash
   flask db upgrade
   ```

3. **Static Files**:
   ```bash
   npm run build
   ```

4. **Web Server**: Use Gunicorn or similar WSGI server

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]

# Frontend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

## Roadmap

### Future Features
- [ ] Mobile app development
- [ ] Advanced AI recommendations
- [ ] Social features for families
- [ ] Integration with school systems
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Voice commands
- [ ] Screen time scheduling
- [ ] Emergency contact features

---

**Built with ❤️ for Telkom families**