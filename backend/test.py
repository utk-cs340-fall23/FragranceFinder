import sys
import os
from dotenv import load_dotenv

load_dotenv('./.env')
secret = os.getenv('JWT_SECRET')
print("test process")
sys.stdout.flush()