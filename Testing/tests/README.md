# Testing

This folder contains the tests for the project.

## Setup

1. Make sure you're in the project root directory
2. Install required packages:
```bash
pip install pytest pytest-cov fastapi httpx sqlalchemy
```

## Running the Tests

Run all tests:
```bash
pytest Testing/tests/
```

Run with coverage report:
```bash
pytest --cov=BackEnd Testing/tests/
```

Run specific test file:
```bash
pytest Testing/tests/test_auth.py -v
```

## Test Structure

- `conftest.py`: Contains pytest fixtures and configuration
- `test_auth.py`: Tests for authentication functionality
- `__init__.py`: Makes the tests directory a Python package

## Coverage Report

Generate a detailed coverage report:
```bash
pytest --cov=BackEnd --cov-report=html Testing/tests/
```

This will create a `htmlcov` directory with a detailed HTML report.

## Test Coverage

```bash
   pytest --cov=tests
