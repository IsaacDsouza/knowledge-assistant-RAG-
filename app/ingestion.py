from fastapi import UploadFile
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import AzureOpenAIEmbeddings
from langchain_redis import RedisVectorStore
from langchain_community.vectorstores import Chroma
import redis
import os
import PyPDF2

AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME")
OPENAI_API_VERSION = os.getenv("OPENAI_API_VERSION", "2025-01-01-preview")

AZURE_REDIS_HOST = os.getenv("AZURE_REDIS_HOST")
AZURE_REDIS_PORT = int(os.getenv("AZURE_REDIS_PORT", "6380"))
AZURE_REDIS_PASSWORD = os.getenv("AZURE_REDIS_PASSWORD")

embeddings = AzureOpenAIEmbeddings(
    azure_deployment=AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME,
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_key=AZURE_OPENAI_API_KEY,
    api_version=OPENAI_API_VERSION,
)

# Try Redis first, fallback to Chroma if RediSearch not available
try:
    # Create Redis client with explicit SSL parameters
    redis_client = redis.StrictRedis(
        host=AZURE_REDIS_HOST,
        port=AZURE_REDIS_PORT,
        password=AZURE_REDIS_PASSWORD,
        ssl=True,
        ssl_cert_reqs=None,  # Disable certificate verification for Azure Redis
        decode_responses=False
    )
    
    # Test if RediSearch is available
    redis_client.execute_command("MODULE LIST")
    
    vectorstore = RedisVectorStore(
        redis_client=redis_client,
        index_name="rag-index",
        embeddings=embeddings,
    )
    print("Using Redis Vector Store")
    
except Exception as e:
    print(f"Redis/RediSearch not available: {e}")
    print("Falling back to Chroma Vector Store")
    
    # Fallback to Chroma (local file-based vector store)
    vectorstore = Chroma(
        persist_directory="./chroma_db",
        embedding_function=embeddings,
    )

def decode_text_with_fallback(file_content: bytes) -> str:
    """Try multiple encodings to decode file content."""
    encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1', 'utf-16']
    
    for encoding in encodings:
        try:
            return file_content.decode(encoding)
        except UnicodeDecodeError:
            continue
    
    # If all encodings fail, try with error handling
    try:
        return file_content.decode('utf-8', errors='replace')
    except:
        return file_content.decode('latin-1', errors='replace')

def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    from io import BytesIO
    text = ""
    with BytesIO(file_bytes) as pdf_stream:
        reader = PyPDF2.PdfReader(pdf_stream)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def ingest_document(file: UploadFile, doc_type: str):
    try:
        file_content = file.file.read()
        
        if doc_type == "text":
            text = decode_text_with_fallback(file_content)
        elif doc_type == "pdf":
            text = extract_text_from_pdf_bytes(file_content)
            if not text.strip():
                return {
                    "status": "error",
                    "message": "No extractable text found in PDF."
                }
        else:
            return {
                "status": "error",
                "message": f"Document type '{doc_type}' not supported. Use 'text' or 'pdf'."
            }
        
        # Split into chunks
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        docs = splitter.create_documents([text])
        
        # Add to vector store
        vectorstore.add_documents(docs)
        
        return {
            "status": "success",
            "message": f"{doc_type.capitalize()} document ingested successfully. Created {len(docs)} chunks.",
            "chunks": len(docs)
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to ingest document: {str(e)}"
        } 