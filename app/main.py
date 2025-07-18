from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from app.rag import query_knowledge_base
from app.nl2sql import nl2sql_query, NL2SQLRequest
from app.ingestion import ingest_document
from pydantic import BaseModel
from app.utils import (
    get_user_collection, get_chat_collection, verify_password, get_password_hash,
    create_access_token, decode_access_token
)
from typing import Optional, List

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://knowledge-assistant-rag.vercel.app","http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

class SignupRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class SaveChatRequest(BaseModel):
    messages: list

# Dependency to get current user from JWT
async def get_current_user(Authorization: Optional[str] = Header(None)):
    if not Authorization or not Authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = Authorization.split(' ')[1]
    payload = decode_access_token(token)
    if not payload or 'sub' not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload['sub']

@app.post("/signup")
def signup(request: SignupRequest):
    users = get_user_collection()
    if users.find_one({"username": request.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed = get_password_hash(request.password)
    users.insert_one({"username": request.username, "password": hashed})
    return {"status": "success"}

@app.post("/login")
def login(request: LoginRequest):
    users = get_user_collection()
    user = users.find_one({"username": request.username})
    if not user or not verify_password(request.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": request.username})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/save_chat")
def save_chat(request: SaveChatRequest, user=Depends(get_current_user)):
    chats = get_chat_collection()
    chats.insert_one({"username": user, "messages": request.messages})
    return {"status": "success"}

@app.get("/get_chats")
def get_chats(user=Depends(get_current_user)):
    chats = get_chat_collection()
    user_chats = list(chats.find({"username": user}, {"_id": 0}))
    return {"chats": user_chats}

@app.post("/query")
def query_endpoint(request: QueryRequest, user=Depends(get_current_user)):
    return query_knowledge_base(request.query)

@app.post("/nl2sql")
def nl2sql_endpoint(request: NL2SQLRequest, user=Depends(get_current_user)):
    return nl2sql_query(request.question)

@app.post("/ingest")
def ingest_endpoint(file: UploadFile = File(...), doc_type: str = Form("text"), user=Depends(get_current_user)):
    return ingest_document(file, doc_type) 