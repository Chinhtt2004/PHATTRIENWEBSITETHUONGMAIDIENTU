from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from vector_store import search_products, update_single_product, delete_single_product
import google.generativeai as genai
import os
from dotenv import load_dotenv

import requests

load_dotenv()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in .env file")
else:
    genai.configure(api_key=GEMINI_API_KEY)

# Spring Boot API Config
BASE_API_URL = os.getenv("BASE_API_URL", "http://localhost:8081/api/public")

app = FastAPI(title="GlowSkin RAG Service")

class QueryRequest(BaseModel):
    message: str
    user_id: Optional[int] = None
    user_name: Optional[str] = None

class QueryResponse(BaseModel):
    response: str

class ProductSyncRequest(BaseModel):
    id: int
    name: str
    description: str

SYSTEM_PROMPT = """
Bạn là một trợ lý bán hàng chuyên nghiệp, thân thiện và am hiểu tại cửa hàng mỹ phẩm GlowSkin.
Nhiệm vụ của bạn là hỗ trợ khách hàng tìm kiếm sản phẩm, tư vấn mỹ phẩm và giải đáp các thắc mắc.

HƯỚNG DẪN TRẢ LỜI:
1. Luôn chào khách hàng một cách lịch sự (Dùng tên khách nếu có: {user_name}).
2. Sử dụng thông tin sản phẩm được cung cấp bên dưới (bao gồm tên, mô tả, giá, danh mục) để tư vấn chính xác và hấp dẫn, có thể thêm các câu dẫn dắt để tăng tính thân thiện và trải nghiệm.
3. Nếu không tìm thấy sản phẩm phù hợp trong dữ liệu, hãy xin lỗi và đề xuất khách hàng liên hệ hotline 1900-xxxx hoặc nhắn tin trực tiếp cho nhân viên tư vấn.
4. Trình bày ngắn gọn, dễ hiểu, sử dụng các icon phù hợp để tăng tính thân thiện.
5. Luôn giữ thái độ tích cực, nhiệt tình và chuyên nghiệp.
6. Nếu khách hàng hỏi về giá hoặc số lượng tồn kho, hãy trả lời theo thông tin được cung cấp trong dữ liệu
7. Không trả lời các câu hỏi không liên quan đến sản phẩm hoặc dịch vụ của cửa hàng

DƯỚI ĐÂY LÀ DANH SÁCH SẢN PHẨM KHỚP VỚI YÊU CẦU (LẤY TỪ HỆ THỐNG):
{context}

CÂU HỎI CỦA KHÁCH HÀNG:
{query}
"""

def fetch_product_details(product_ids: List[str]) -> str:
    """
    Calls Spring Boot API to get full details for each product ID.
    """
    context_parts = []
    for pid in product_ids:
        try:
            response = requests.get(f"{BASE_API_URL}/product/{pid}", timeout=2)
            if response.status_code == 200:
                p = response.json()
                details = (
                    f"- Tên: {p.get('name')}\n"
                    f"  Mô tả: {p.get('description')}\n"
                    f"  Giá: {p.get('price'):,.0f} VND\n"
                    f"  Tồn kho: {p.get('stockQuantity')}\n"
                    f"  Danh mục: {p.get('category', {}).get('name') if isinstance(p.get('category'), dict) else 'Chưa phân loại'}"
                )
                context_parts.append(details)
            else:
                print(f"Error fetching product {pid}: {response.status_code}; Continue...")
                continue
        except Exception as e:
            print(f"Error fetching product {pid}: {e}")
            continue
    
    return "\n\n".join(context_parts) if context_parts else "Không tìm thấy thông tin chi tiết sản phẩm."

@app.get("/")
async def root():
    return {"message": "GlowSkin RAG Service is running"}

@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    try:
        # 1. Vector Search for products (Get IDs)
        search_results = search_products(request.message, n_results=5)
        
        # 2. Fetch Full Details from Spring Boot
        product_ids = []
        if search_results and "ids" in search_results:
            product_ids = search_results["ids"][0]
        
        context = fetch_product_details(product_ids)
        
        # 3. Create Prompt
        prompt = SYSTEM_PROMPT.format(
            user_name=request.user_name or "bạn",
            context=context,
            query=request.message
        )
        
        # 4. Call Gemini
        if not GEMINI_API_KEY:
            return QueryResponse(response="Dịch vụ AI chưa được cấu hình (Thiếu GEMINI_API_KEY). Vui lòng liên hệ kỹ thuật.")
            
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        
        return QueryResponse(response=response.text)
        
    except Exception as e:
        print(f"Error in RAG query: {str(e)}")
        return QueryResponse(response="Rất tiếc, tôi đang gặp chút trục trặc khi xử lý yêu cầu. Bạn vui lòng thử lại sau nhé! 🙏")

@app.post("/sync-product")
async def sync_product(request: ProductSyncRequest):
    try:
        update_single_product(request.id, request.name, request.description)
        return {"status": "success", "message": f"Product {request.id} indexed/updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/delete-product/{product_id}")
async def delete_product(product_id: int):
    try:
        delete_single_product(product_id)
        return {"status": "success", "message": f"Product {product_id} deleted from index"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
