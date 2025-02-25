import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_path = str(Path(__file__).parent.parent.parent / "BackEnd")
sys.path.append(backend_path) 