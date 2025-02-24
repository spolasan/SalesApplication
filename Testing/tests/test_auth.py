import pytest
from fastapi.testclient import TestClient
from main import app
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import get_db, Base
from models import User as UserModel
from passlib.context import CryptContext

# Setup the test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency override
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create the database tables
Base.metadata.create_all(bind=engine)

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

# Test client
client = TestClient(app)

@pytest.fixture(scope="module")
def setup_database():
    # Create the test database and user
    db = TestingSessionLocal()
    create_test_user(db)
    yield
    db.close()

def test_login_success(setup_database):
    response = client.post(
        "/token",
        data={"username": "testuser", "password": "testpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_failure_incorrect_password(setup_database):
    response = client.post(
        "/token",
        data={"username": "testuser", "password": "wrongpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect password"

def test_login_failure_user_not_found(setup_database):
    response = client.post(
        "/token",
        data={"username": "nonexistentuser", "password": "testpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "User not found" 