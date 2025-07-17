from langchain_openai import AzureChatOpenAI
from pydantic import BaseModel
import os

AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
OPENAI_API_VERSION = os.getenv("OPENAI_API_VERSION", "2025-01-01-preview")

llm = AzureChatOpenAI(
    azure_deployment=AZURE_OPENAI_DEPLOYMENT_NAME,
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_key=AZURE_OPENAI_API_KEY,
    api_version=OPENAI_API_VERSION,
)

class NL2SQLRequest(BaseModel):
    question: str

def nl2sql_query(question: str):
    prompt = f"""
    You are an expert in translating natural language to SQL. Given the question, generate a SQL query.
    Question: {question}
    SQL:"""
    sql = llm.predict(prompt)
    # Here, you would execute the SQL against your DB and return results. We'll mock it.
    return {"sql": sql, "result": "[MOCKED] DB results would appear here."} 