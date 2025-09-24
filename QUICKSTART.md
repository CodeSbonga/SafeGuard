# 🚀 Telkom Family Dashboard - Quick Start Guide

## ⚡ One-Command Setup

```bash
./setup.sh
```

This will automatically:
- ✅ Check prerequisites (Python 3.8+, Node.js 16+)
- ✅ Set up Python virtual environment
- ✅ Install all backend dependencies
- ✅ Initialize the database
- ✅ Install all frontend dependencies
- ✅ Create run scripts

## 🎯 Quick Launch

### Option 1: Automated Scripts
```bash
# Terminal 1 - Start Backend
./run_backend.sh

# Terminal 2 - Start Frontend  
./run_frontend.sh
```

### Option 2: Manual Commands
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
python app.py

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🌐 Access the Application

1. **Open your browser**: http://localhost:3000
2. **Login with demo credentials**:
   - **Parent**: username=`parent`, password=`password123`
   - **Student**: username=`student`, password=`password123`

## 🎮 What You Can Do

### As a Parent:
- 👨‍👩‍👧‍👦 **Manage Family**: Add/remove children, set website rules
- 📊 **View Analytics**: Real-time usage reports with charts
- 🎯 **Study Mode**: Track educational vs. entertainment time
- 📄 **Export Reports**: Download CSV/PDF reports
- 🤖 **AI Insights**: Get recommendations for better digital wellness

### As a Student:
- 📚 **Study Dashboard**: View allowed websites and study time
- 🎮 **Game Zone**: Play educational games (Memory, Snake & Ladders, Math, Word Builder)
- 📈 **Progress Tracking**: Monitor your study achievements
- 🎯 **Focus Mode**: Access educational content with time tracking

## 🎨 Features Overview

### 🏠 Telkom Dashboard
- Exact Telkom blue (#0073CF) branding
- Professional, clean interface
- Responsive design for mobile & desktop
- Real-time clock and user management

### 👨‍👩‍👧‍👦 myFamily Parental Control
- **Website Whitelisting**: Allow/block specific sites
- **Study Mode**: Track educational vs. entertainment time
- **Usage Analytics**: Interactive charts and reports
- **AI Recommendations**: Smart suggestions for digital wellness
- **Export Functionality**: CSV/PDF reports for offline analysis

### 🎮 Educational Game Zone
- **Memory Match**: Card matching for memory improvement
- **Snake & Ladders**: Classic board game with scoring
- **Math Challenge**: Timed math problems with rewards
- **Word Builder**: Word formation from given letters
- Child-friendly interface with progress tracking

### 📊 Analytics & Reporting
- Real-time usage statistics
- Interactive Plotly charts
- Study efficiency tracking
- Weekly progress reports
- AI-powered insights and recommendations

## 🔧 Troubleshooting

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:5000/api/login

# Restart backend
cd backend
source venv/bin/activate
python app.py
```

### Frontend Issues
```bash
# Clear npm cache
cd frontend
npm cache clean --force
npm install
npm start
```

### Database Issues
```bash
# Reset database
cd backend
rm ../data/app.db
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

## 📱 Mobile Testing

The app is fully responsive and works on:
- 📱 Mobile phones (iOS/Android)
- 📱 Tablets (iPad/Android tablets)
- 💻 Desktop computers
- 🖥️ Large screens

## 🎯 Demo Scenarios

### Parent Workflow:
1. Login as parent
2. Go to "myFamily" dashboard
3. Add website rules (e.g., allow khanacademy.org, block youtube.com)
4. Enable study mode for educational sites
5. View analytics and AI recommendations
6. Export reports for offline review

### Student Workflow:
1. Login as student
2. View allowed websites
3. Start study sessions on educational sites
4. Play games in Game Zone during breaks
5. Track progress and achievements

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**:
   ```bash
   export FLASK_ENV=production
   export SECRET_KEY=your-secure-secret-key
   ```

2. **Database**: Use PostgreSQL instead of SQLite
3. **Web Server**: Use Gunicorn or similar WSGI server
4. **Static Files**: Build React app with `npm run build`
5. **SSL**: Enable HTTPS for security

## 📞 Support

- 📖 **Documentation**: See README.md for detailed information
- 🐛 **Issues**: Check console logs for error messages
- 🔧 **Debug**: Use browser developer tools for frontend issues
- 📊 **Analytics**: Check backend logs for API issues

## 🎉 Success!

If everything is working correctly, you should see:
- ✅ Telkom-branded login page
- ✅ Professional dashboard with real-time clock
- ✅ Working myFamily parental controls
- ✅ Interactive analytics with charts
- ✅ Fun educational games
- ✅ Export functionality for reports

**Enjoy your Telkom Family Dashboard! 🚀**