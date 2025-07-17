# Enterprise Knowledge Assistant

A fullstack, production-ready enterprise knowledge assistant. Built with FastAPI, React, Azure OpenAI, MongoDB Atlas, and Chroma, it supports RAG, NL2SQL, multi-modal ingestion, and user authentication.

---

##  Project Overview

This assistant enables enterprise users to chat with internal knowledge, generate SQL from natural language, and ingest documents (text, PDF, images, audio) for retrieval-augmented generation (RAG). It features secure authentication, chat history, and a modern, responsive UI.

---

##  Features
- **Chat with Knowledge Base (RAG)**
- **NL2SQL**: Natural language to SQL (mocked for demo)
- **Document Ingestion**: PDF, text, images, audio
- **User Authentication**: JWT-secured, MongoDB Atlas
- **Chat History**: Per-user, persistent
- **Modern React UI**: MUI, light/dark mode, responsive
- **Dockerized**: Easy deployment
- **Azure OpenAI**: LLM and embeddings

---

## Architecture

**System Overview:**

- **Frontend:**  
  React (TypeScript, Material-UI)  
  ↳ Communicates with backend via REST API and WebSockets

- **Backend:**  
  FastAPI (Python)  
  ↳ Handles business logic, authentication, and API endpoints  
  ↳ Serves static files (React build)

- **LLM & Embeddings:**  
  Azure OpenAI  
  ↳ Used by backend for chat, RAG, and NL2SQL

- **Vector Database:**  
  Chroma  
  ↳ Stores and retrieves document embeddings for RAG

- **User & Chat Data:**  
  MongoDB Atlas  
  ↳ Stores user accounts, authentication, and chat history

---

**Data Flow:**

1. **User interacts with the React frontend** (chat, NL2SQL, document upload).
2. **Frontend sends requests to FastAPI backend** (REST/WebSocket).
3. **Backend processes requests:**
   - For chat/RAG:  
     - Retrieves relevant document chunks from Chroma (vector search).
     - Calls Azure OpenAI for LLM responses and embeddings.
   - For NL2SQL:  
     - Generates SQL from natural language (mocked or real).
   - For ingestion:  
     - Chunks and embeds documents, stores in Chroma.
   - For authentication and chat history:  
     - Reads/writes user and chat data in MongoDB Atlas.
4. **Backend returns results to the frontend** for display.

---

**Component Diagram (Textual):**

```
[User]
   │
   ▼
[React Frontend]
   │  REST/WS
   ▼
[FastAPI Backend] ──→ [Azure OpenAI] (LLM/Embeddings)
      │
      ├──→ [Chroma] (Vector DB)
      │
      └──→ [MongoDB Atlas] (User & Chat Data)
```

---

##  Tech Stack
- **Frontend**: React, TypeScript, Material-UI
- **Backend**: FastAPI, LangChain, PyPDF2, JWT
- **LLM/Embeddings**: Azure OpenAI
- **Vector DB**: Chroma (fallback from Redis)
- **Database**: MongoDB Atlas
- **Containerization**: Docker, Docker Compose
- **Deployment**: Azure Web App for Containers / Container Apps

---

##  Setup & Deployment

### 1. Clone & Configure
```sh
git clone https://github.com/<your-username>/<repo-name>.git
cd ai-asst
cp .env.example .env  # Edit with your secrets
```

### 2. Build & Run (Docker Compose)
```sh
docker-compose up --build
```

### 3. Deploy to Azure
- Build and push Docker image to Azure Container Registry (ACR)
- Deploy via Azure Web App for Containers or Container Apps
- Set environment variables in Azure Portal
- Whitelist Azure IPs in MongoDB Atlas

---

##  Environment Variables

Example `.env`:
```
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_CHAT_DEPLOYMENT=...
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=...
AZURE_OPENAI_API_VERSION=2023-05-15
MONGODB_URI=...
MONGODB_DB=ai-asst
JWT_SECRET=...
CHROMA_PERSIST_DIRECTORY=chroma_data
```

---

##  Usage
- **Chat**: Ask questions, retrieve knowledge, view chat history
- **NL2SQL**: Enter natural language, get SQL (mocked)
- **Ingest**: Upload documents for RAG
- **Auth**: Sign up, log in, JWT-secured endpoints

---

[MIT](LICENSE) 