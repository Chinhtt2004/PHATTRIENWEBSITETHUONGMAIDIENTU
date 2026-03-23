import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize ChromaDB client
client = chromadb.PersistentClient(path="./chroma_db")

# Use BGE-M3 (Excellent for Vietnamese/Multilingual)
bge_ef = SentenceTransformerEmbeddingFunction(model_name="BAAI/bge-m3")

# Get or create collection with BGE embedding function
collection = client.get_or_create_collection(
    name="products",
    embedding_function=bge_ef
)

def index_products(products):
    """
    products: list of dicts with 'id', 'name', 'description'
    """
    ids = [str(p['id']) for p in products]
    documents = [f"Product: {p['name']}. Description: {p['description']}" for p in products]
    metadatas = [{"id": p['id'], "name": p['name']} for p in products]
    
    collection.add(
        ids=ids,
        documents=documents,
        metadatas=metadatas
    )

def update_single_product(product_id, name, description):
    """
    Updates or inserts a single product in the vector store.
    """
    content = f"Product: {name}. Description: {description}"
    collection.upsert(
        ids=[str(product_id)],
        documents=[content],
        metadatas=[{"id": product_id, "name": name}]
    )

def delete_single_product(product_id):
    """
    Deletes a single product from the vector store.
    """
    collection.delete(ids=[str(product_id)])

def search_products(query, n_results=3):
    results = collection.query(
        query_texts=[query],
        n_results=n_results
    )
    return results