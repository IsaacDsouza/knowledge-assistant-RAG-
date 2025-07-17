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


graph TD
  A[React Frontend (MUI, TS)] -- REST/WS --> B[FastAPI Backend]
  B -- Embeddings/LLM --> C[Azure OpenAI]
  B -- Vector Search --> D[Chroma]
  B -- User/Chat Data --> E[MongoDB Atlas]
  B -- Auth --> E
  B -- Static Files --> A


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