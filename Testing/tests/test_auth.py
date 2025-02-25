import sys
import os
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend directory to path
backend_path = str(Path(__file__).parent.parent.parent / "BackEnd")
sys.path.append(backend_path)

# Import app and other backend modules after adding backend path
from main import app  # Add this import
from database import get_db, Base
from models import User as UserModel
from passlib.context import CryptContext

# Setup test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create test database tables
Base.metadata.create_all(bind=engine)

# Test client
client = TestClient(app)

# Create a test user
def create_test_user(db):
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_password = pwd_context.hash("testpassword")
    test_user = UserModel(
        username="testuser",
        email="test@example.com",
        full_name="Test User",
        hashed_password=hashed_password
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)

@pytest.fixture(scope="module")
def setup_database():
    # Create the test database and user
    db = TestingSessionLocal()
    create_test_user(db)
    yield
    db.close()

def test_create_user():
    response = client.post(
        "/create-test-user",
    )
    assert response.status_code == 200
    assert "message" in response.json()

def test_login_success():
    # First ensure test user exists
    client.post("/create-test-user")
    
    response = client.post(
        "/token",
        data={"username": "demo", "password": "demo123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_wrong_password():
    response = client.post(
        "/token",
        data={"username": "demo", "password": "wrongpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 401

def test_login_wrong_username():
    response = client.post(
        "/token",
        data={"username": "nonexistent", "password": "demo123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 401

def test_protected_route():
    # First login to get token
    login_response = client.post(
        "/token",
        data={"username": "demo", "password": "demo123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    token = login_response.json()["access_token"]
    
    # Test protected route
    response = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == "demo" 