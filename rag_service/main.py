from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from vector_store import search_products, update_single_product, delete_single_product
import google.generativeai as genai
import os
from dotenv import load_dotenv

import requests
from tools import search_products_by_keyword, get_best_selling_products, get_flash_sale_products, check_order_status, check_user_cart, get_product_reviews, get_store_policies, recommend_skincare_routine
from context_var import request_token

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
    token: Optional[str] = None

class QueryResponse(BaseModel):
    response: str

class ProductSyncRequest(BaseModel):
    id: int
    name: str
    description: str

SYSTEM_PROMPT = """
Bạn là một trợ lý bán hàng chuyên nghiệp, thân thiện và am hiểu tại cửa hàng mỹ phẩm GlowSkin.
Nhiệm vụ của bạn là hỗ trợ khách hàng tìm kiếm sản phẩm, tư vấn mỹ phẩm và giải đáp các thắc mắc bằng cách sử dụng TẤT CẢ các công cụ (tools) được cung cấp.

HƯỚNG DẪN TRẢ LỜI CỰC KỲ QUAN TRỌNG:
1. Luôn chào khách hàng một cách lịch sự. Tưng tửng, đáng yêu. Thái độ tích cực, nhiệt tình, chuyên nghiệp. Trình bày ngắn gọn, dễ hiểu, sử dụng icon phù hợp để tăng tính thân thiện
2. NẾU KHÁCH HỎI TÌM SẢN PHẨM (Ví dụ: "Mình muốn tìm sữa rửa mặt", "Có son nào đẹp không"): 
   -> Gọi hàm `search_products_by_keyword`.
3. NẾU KHÁCH HỎI SẢN PHẨM BÁN CHẠY (Ví dụ: "Sản phẩm nào hot", "Shop có gì bán chạy"): 
   -> Gọi hàm `get_best_selling_products`.
4. NẾU KHÁCH HỎI KHUYẾN MÃI/FLASH SALE (Ví dụ: "Hôm nay có gì sale"): 
   -> Gọi hàm `get_flash_sale_products`.
5. NẾU KHÁCH HỎI TRẠNG THÁI ĐƠN HÀNG (Ví dụ: "Đơn hàng 12 của tôi thế nào rồi?"):
   -> Gọi hàm `check_order_status` với order_id truyền vào (nếu khách không đưa ID, hãy hỏi ID trước).
6. NẾU KHÁCH HỎI VỀ GIỎ HÀNG CỦA HỌ (Ví dụ: "Trong giỏ của tôi có gì?"):
   -> Gọi hàm `check_user_cart`. Nếu trả về lỗi báo đăng nhập, hãy hướng dẫn khách vui lòng đăng nhập trên website.
7. NẾU KHÁCH HỎI VỀ NHẬN XÉT/ĐÁNH GIÁ (Ví dụ: "Sản phẩm này mọi người review sao?"):
   -> Gọi hàm `get_product_reviews` truyền id sản phẩm.
8. NẾU KHÁCH HỎI VỀ CHÍNH SÁCH CỬA HÀNG (Ví dụ: "Shop có cho đổi trả không", "Phí ship thế nào"):
   -> Gọi hàm `get_store_policies`.
9. NẾU KHÁCH MUỐN TƯ VẤN QUY TRÌNH DƯỠNG DA MỚI (Ví dụ: "Tư vấn cho tôi da mụn", "skincare routine lỗ chân lông to"):
   -> Gọi hàm `recommend_skincare_routine`.
10. Đợi kết quả từ hàm, dùng để tổng hợp câu trả lời tự nhiên, thân thiện.
11. NẾU GỌI HÀM KẾT QUẢ RỖNG, hãy xin lỗi và phản hồi thân thiện. BẠN TUYỆT ĐỐI KHÔNG ĐƯỢC BỊA THÔNG TIN SẢN PHẨM HAY GIÁ TRỊ GIẢ TƯỞNG CỦA CỬA HÀNG.
"""

# Các tools được định nghĩa và quản lý trong file tools.py
# =================================================

@app.get("/")
async def root():
    return {"message": "GlowSkin RAG Service is running"}

@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    try:
        if request.token:
            request_token.set(request.token)
        else:
            request_token.set(None)
            
        if not GEMINI_API_KEY:
            return QueryResponse(response="Dịch vụ AI chưa được cấu hình. Vui lòng thử lại sau.")
            
        # Khởi tạo mô hình với các custom tools
        model = genai.GenerativeModel(
            model_name='gemini-2.5-flash-lite',
            tools=[search_products_by_keyword, get_best_selling_products, get_flash_sale_products, check_order_status, check_user_cart, get_product_reviews, get_store_policies, recommend_skincare_routine]
        )
        
        # Thiết lập System Prompt thông qua tin nhắn mồi (nhằm tương thích với các phiên bản SDK)
        # Bắt đầu session chat tự động gọi tool
        chat = model.start_chat(
            history=[
                {"role": "user", "parts": [SYSTEM_PROMPT]},
                {"role": "model", "parts": ["Ok! Tôi đã hiểu hướng dẫn và công cụ. Tôi sẽ làm theo."]}
            ],
            enable_automatic_function_calling=True
        )
        
        # Gửi lời nhắn của khách hàng và nhận phản hồi
        greeting = f"Tên của tôi là {request.user_name}. " if request.user_name else ""
        user_msg = greeting + request.message
        
        response = chat.send_message(user_msg)
        
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
