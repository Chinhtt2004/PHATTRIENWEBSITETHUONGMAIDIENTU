package com.tuongchinh.Controller;

import com.tuongchinh.DTO.ChatRequest;
import com.tuongchinh.DTO.ChatResponse;
import com.tuongchinh.Entity.ChatMessage;
import com.tuongchinh.Entity.User;
import com.tuongchinh.Repository.ChatMessageRepository;
import com.tuongchinh.Service.ChatService;
import com.tuongchinh.Service.JwtService;
import com.tuongchinh.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;
    private final JwtService jwtService;
    private final ChatMessageRepository chatMessageRepository;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest chatRequest,
            HttpServletRequest request) {
        
        String token = userService.extractToken(request);
        User user = null;
        if (token != null) {
            Long userId = jwtService.extractUserId(token);
            user = userService.findById(userId);
        }

        if (user == null) {
            String hardcodedMsg = "Cảm ơn bạn đã quan tâm đến GlowSkin! 👋 Để được tư vấn chi tiết hơn bằng AI và xem lại lịch sử trò chuyện, bạn vui lòng **Đăng nhập** nhé. \n\nHôm nay bạn cần tìm sản phẩm nào không?";
            return ResponseEntity.ok(new ChatResponse(hardcodedMsg));
        }

        ChatResponse response = chatService.getResponse(user, chatRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getHistory(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            HttpServletRequest request) {
        String token = userService.extractToken(request);
        if (token == null) {
            return ResponseEntity.status(401).build();
        }
        Long userId = jwtService.extractUserId(token);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ChatMessage> historyPage = chatMessageRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        
        // We reverse the list because the UI expects chronological order (Asc)
        // while we fetch most recent first (Desc) for pagination
        List<ChatMessage> history = historyPage.getContent().stream()
                .sorted((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()))
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(history);
    }
}
