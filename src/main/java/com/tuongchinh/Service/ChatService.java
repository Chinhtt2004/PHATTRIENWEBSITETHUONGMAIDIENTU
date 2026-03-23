package com.tuongchinh.Service;

import com.tuongchinh.DTO.ChatRequest;
import com.tuongchinh.DTO.ChatResponse;
import com.tuongchinh.Entity.ChatMessage;
import com.tuongchinh.Entity.User;
import com.tuongchinh.Repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final RestTemplate restTemplate;

    @Value("${rag.service.url:http://localhost:8000/query}")
    private String queryUrl;

    @Value("${rag.sync.url:http://localhost:8000/sync-product}")
    private String syncUrl;

    @Value("${rag.delete.url:http://localhost:8000/delete-product/}")
    private String deleteUrl;

    public ChatResponse getResponse(User user, ChatRequest request) {
        // ... payload preparation ...
        Map<String, Object> payload = new HashMap<>();
        payload.put("message", request.getMessage());
        payload.put("user_id", user != null ? user.getId() : null);
        payload.put("user_name", user != null ? user.getName() : "Khách");
        
        String botResponse;
        try {
            ChatResponse pythonResponse = restTemplate.postForObject(queryUrl, payload, ChatResponse.class);
            botResponse = (pythonResponse != null) ? pythonResponse.getResponse() : "Xin lỗi, chatbot đang gặp sự cố.";
        } catch (Exception e) {
            botResponse = "Xin lỗi, tôi không thể kết nối với dịch vụ AI lúc này. Vui lòng thử lại sau.";
        }
        
        // ... database save (only if user is logged in) ...
        if (user != null) {
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setUser(user);
            chatMessage.setMessage(request.getMessage());
            chatMessage.setResponse(botResponse);
            chatMessageRepository.save(chatMessage);
        }

        return new ChatResponse(botResponse);
    }

    public void syncProduct(Long id, String name, String description) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", id);
        payload.put("name", name);
        payload.put("description", description);
        try {
            restTemplate.postForObject(syncUrl, payload, String.class);
        } catch (Exception e) {
            System.err.println("Failed to sync product to RAG: " + e.getMessage());
        }
    }

    public void deleteProduct(Long id) {
        try {
            restTemplate.delete(deleteUrl + id);
        } catch (Exception e) {
            System.err.println("Failed to delete product from RAG: " + e.getMessage());
        }
    }
}
