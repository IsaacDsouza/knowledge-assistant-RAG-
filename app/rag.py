from langchain.chains import RetrievalQA
from langchain_redis import RedisVectorStore
from langchain_openai import AzureOpenAIEmbeddings, AzureChatOpenAI
from langchain_community.vectorstores import Chroma
import redis
import os

# Load environment variables
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")  # For LLM
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME")  # For embeddings
OPENAI_API_VERSION = os.getenv("OPENAI_API_VERSION", "2025-01-01-preview")

AZURE_REDIS_HOST = os.getenv("AZURE_REDIS_HOST")
AZURE_REDIS_PORT = int(os.getenv("AZURE_REDIS_PORT", "6380"))
AZURE_REDIS_PASSWORD = os.getenv("AZURE_REDIS_PASSWORD")

# Embeddings and LLM
embeddings = AzureOpenAIEmbeddings(
    azure_deployment=AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME,
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_key=AZURE_OPENAI_API_KEY,
    api_version=OPENAI_API_VERSION,
)
llm = AzureChatOpenAI(
    azure_deployment=AZURE_OPENAI_DEPLOYMENT_NAME,
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
    
    # Vector store with explicit client
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

# RAG chain
qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(),
)

def query_knowledge_base(query: str):
    # Retrieve relevant documents
    docs = vectorstore.as_retriever().get_relevant_documents(query)
    print(f"Retrieved docs: {docs}")
    result = qa.run(query)
    return {"result": result}