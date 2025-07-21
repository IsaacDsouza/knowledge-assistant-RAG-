# Enterprise Knowledge Assistant

[![Backend Deployed on Azure](https://img.shields.io/badge/Azure-Backend%20Live-blue?logo=azure)](https://isaac-knowledge-asst-2024.azurewebsites.net/docs)

A fullstack, production-ready enterprise knowledge assistant. Built with FastAPI, React, Azure OpenAI, MongoDB Atlas, Redis, and Chroma, it supports RAG, NL2SQL, multi-modal ingestion, and user authentication.

---

##  Live Backend

- **API & Docs:** [https://isaac-knowledge-asst-2024.azurewebsites.net/docs](https://isaac-knowledge-asst-2024.azurewebsites.net/docs)

---

## Project Overview

This assistant enables enterprise users to chat with internal knowledge, generate SQL from natural language, and ingest documents (text, PDF, images, audio) for retrieval-augmented generation (RAG). It features secure authentication, chat history, and a modern, responsive UI with the help of Redis, Azure containers, Azure OpenAI.

---

## Features
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
  Chroma  and Redis
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
      ├──→ [Redis/Chroma] (Vector DB)
      │
      └──→ [MongoDB Atlas] (User & Chat Data)
```

---

##  Containerization & Azure Deployment

This project is fully containerized using **Docker** for seamless deployment and scalability.

### **Containerization**
- The backend (FastAPI) is built and run from the provided Dockerfile.
- To run the frontend, you must build and serve it separately (e.g., using `npm start` for development or deploying the `build` output to a static host).
- All backend dependencies are managed via `requirements.txt` (Python), and frontend dependencies via `package.json` (Node/React).

### **Azure Deployment**
- The Docker image is pushed to **Azure Container Registry (ACR)**.
- The backend is deployed using **Azure Web App for Containers**, which pulls the image from ACR and runs it as a managed service.
- Environment variables (secrets, API keys, DB URIs) are securely managed in the Azure Portal.
- MongoDB Atlas IP whitelisting ensures secure database connectivity.
- The backend is accessible at [https://isaac-knowledge-asst-2024.azurewebsites.net](https://isaac-knowledge-asst-2024.azurewebsites.net).

#### **Deployment Steps (Summary):**
1. **Build Docker image:**
   ```sh
   docker build -t ai-asst:latest .
   ```
2. **Tag and push to ACR:**
   ```sh
   docker tag ai-asst:latest aiasstproj.azurecr.io/ai-asst:latest
   docker push aiasstproj.azurecr.io/ai-asst:latest
   ```
3. **Configure Azure Web App for Containers:**
   - Set image source to ACR
   - Set registry credentials
   - Set environment variables
   - Restart the app after each deployment

---

## Environment Variables

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
REDIS_URL=...
```

---

## Usage
- **Chat**: Ask questions, retrieve knowledge, view chat history
- **NL2SQL**: Enter natural language, get SQL (mocked)
- **Ingest**: Upload documents for RAG
- **Auth**: Sign up, log in, JWT-secured endpoints

---


## License
[MIT](LICENSE) 