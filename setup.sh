#!/bin/bash

echo "🚀 Setting up Telkom Family Dashboard..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed. Please install npm and try again."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Create data directory if it doesn't exist
if [ ! -d "../data" ]; then
    mkdir -p ../data
fi

# Initialize database
echo "🗄️ Initializing database..."
python -c "
from app import app, db
with app.app_context():
    db.create_all()
    print('Database initialized successfully!')
"

echo "✅ Backend setup complete!"

# Setup frontend
echo "🔧 Setting up frontend..."
cd ../frontend

# Install Node.js dependencies
echo "📥 Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete!"

# Create run scripts
echo "📝 Creating run scripts..."

# Backend run script
cat > ../run_backend.sh << 'EOF'
#!/bin/bash
cd backend
source venv/bin/activate
echo "🚀 Starting Flask backend server..."
echo "📍 Backend will be available at: http://localhost:5000"
flask run --host=0.0.0.0 --port=5000
EOF

# Frontend run script
cat > ../run_frontend.sh << 'EOF'
#!/bin/bash
cd frontend
echo "🚀 Starting React frontend server..."
echo "📍 Frontend will be available at: http://localhost:3000"
npm start
EOF

# Make scripts executable
chmod +x ../run_backend.sh
chmod +x ../run_frontend.sh

echo "✅ Run scripts created!"

# Create VS Code Live Server setup
cat > ../run_live_server.md << 'EOF'
# VS Code Live Server Setup

For quick testing without React build process:

1. Install "Live Server" extension in VS Code
2. Right-click on `frontend/public/index.html`
3. Select "Open with Live Server"
4. The app will open in your browser

Note: This method has limited functionality compared to the full React setup.
EOF

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend: ./run_backend.sh"
echo "2. Start the frontend: ./run_frontend.sh"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "🔑 Demo credentials:"
echo "   Parent: username=parent, password=password123"
echo "   Student: username=student, password=password123"
echo ""
echo "📚 For VS Code Live Server setup, see: run_live_server.md"
echo ""
echo "Happy coding! 🚀"