#!/usr/bin/env python3
"""
Test script for Telkom Family Dashboard
This script tests the basic functionality of the Flask backend
"""

import requests
import json
import time
import sys

BASE_URL = "http://localhost:5000/api"

def test_connection():
    """Test if the backend is running"""
    try:
        response = requests.get(f"{BASE_URL}/login", timeout=5)
        return True
    except requests.exceptions.RequestException:
        return False

def test_registration():
    """Test user registration"""
    print("Testing user registration...")
    
    # Test parent registration
    parent_data = {
        "username": "test_parent",
        "email": "test_parent@telkom.co.za",
        "password": "test123",
        "role": "parent"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/register", json=parent_data)
        if response.status_code == 201:
            print("✅ Parent registration successful")
            return response.json().get('user_id')
        else:
            print(f"❌ Parent registration failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Parent registration error: {e}")
        return None

def test_login():
    """Test user login"""
    print("Testing user login...")
    
    login_data = {
        "username": "parent",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        if response.status_code == 200:
            print("✅ Login successful")
            return response.json().get('user')
        else:
            print(f"❌ Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_analytics():
    """Test analytics endpoint"""
    print("Testing analytics endpoint...")
    
    try:
        response = requests.get(f"{BASE_URL}/parent/analytics")
        if response.status_code == 200:
            data = response.json()
            print("✅ Analytics endpoint working")
            print(f"   Study time: {data.get('total_study_time', 0)} minutes")
            print(f"   Distraction time: {data.get('total_distraction_time', 0)} minutes")
            print(f"   Study efficiency: {data.get('study_efficiency', 0)}%")
            return True
        else:
            print(f"❌ Analytics failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Analytics error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Telkom Family Dashboard Backend")
    print("=" * 50)
    
    # Test connection
    print("Testing backend connection...")
    if not test_connection():
        print("❌ Backend is not running!")
        print("Please start the backend with: cd backend && python app.py")
        sys.exit(1)
    print("✅ Backend is running")
    
    # Test registration
    parent_id = test_registration()
    
    # Test login
    user = test_login()
    
    # Test analytics
    test_analytics()
    
    print("\n" + "=" * 50)
    print("🎉 Basic tests completed!")
    print("\nTo start the full application:")
    print("1. Backend: cd backend && python app.py")
    print("2. Frontend: cd frontend && npm start")
    print("3. Open: http://localhost:3000")
    print("\nDemo credentials:")
    print("Parent: username=parent, password=password123")
    print("Student: username=student, password=password123")

if __name__ == "__main__":
    main()