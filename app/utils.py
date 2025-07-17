import os
from pymongo import MongoClient
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from urllib.parse import urlparse

MONGODB_URI = os.getenv('MONGODB_URI')
DB_NAME = os.getenv('MONGODB_DB')

if not DB_NAME and MONGODB_URI:
    parsed = urlparse(MONGODB_URI)
    if parsed.path and parsed.path != '/':
        DB_NAME = parsed.path.lstrip('/')
    else:
        DB_NAME = 'ai_asst'  # fallback default

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

# Ensure collections exist (MongoDB creates them on first insert, but we can create explicitly)
if 'users' not in db.list_collection_names():
    db.create_collection('users')
if 'chats' not in db.list_collection_names():
    db.create_collection('chats')

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_collection():
    return db['users']

def get_chat_collection():
    return db['chats']

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None 