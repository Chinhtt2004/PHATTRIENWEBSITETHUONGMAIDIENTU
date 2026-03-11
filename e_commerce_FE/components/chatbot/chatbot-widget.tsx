"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WELCOME_CONTENT =
  "Xin chào! 👋 Mình là trợ lý GlowSkin. Mình có thể giúp bạn tìm sản phẩm, tư vấn chăm sóc da, hoặc hỗ trợ đơn hàng. Bạn cần giúp gì nào?";

const QUICK_REPLIES = [
  "Tư vấn chăm sóc da",
  "Sản phẩm bán chạy",
  "Kiểm tra đơn hàng",
  "Chính sách đổi trả",
];

function generateAutoReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("chăm sóc da") || msg.includes("skincare") || msg.includes("tư vấn")) {
    return "Để tư vấn chính xác, bạn cho mình biết loại da của bạn nhé (da dầu, da khô, da hỗn hợp, hay da nhạy cảm)? 🧴\n\nMột số sản phẩm được yêu thích:\n• Serum Vitamin C 20% — làm sáng da, mờ thâm\n• Kem Dưỡng Ẩm Hyaluronic Acid — cấp ẩm sâu\n• Sữa Rửa Mặt Dịu Nhẹ — phù hợp mọi loại da";
  }
  if (msg.includes("bán chạy") || msg.includes("best seller") || msg.includes("phổ biến")) {
    return "Đây là top sản phẩm bán chạy nhất của GlowSkin 🔥:\n\n1. Serum Vitamin C 20% — 450.000₫\n2. Kem Chống Nắng SPF50+ — 320.000₫\n3. Mặt Nạ Collagen — 35.000₫/miếng\n\nBạn muốn xem chi tiết sản phẩm nào?";
  }
  if (msg.includes("đơn hàng") || msg.includes("kiểm tra") || msg.includes("tracking")) {
    return "Để kiểm tra đơn hàng, bạn vui lòng:\n\n1. Đăng nhập vào tài khoản\n2. Vào mục \"Đơn hàng của tôi\"\n\nHoặc bạn cung cấp mã đơn hàng, mình sẽ hỗ trợ tra cứu ngay! 📦";
  }
  if (msg.includes("đổi trả") || msg.includes("hoàn tiền") || msg.includes("chính sách")) {
    return "Chính sách đổi trả của GlowSkin 📋:\n\n• Đổi trả miễn phí trong 30 ngày\n• Sản phẩm còn nguyên seal/tem\n• Hoàn tiền trong 3-5 ngày làm việc\n• Liên hệ hotline: 1900-xxxx\n\nBạn cần đổi trả sản phẩm nào ạ?";
  }
  if (msg.includes("khuyến mãi") || msg.includes("giảm giá") || msg.includes("sale") || msg.includes("voucher")) {
    return "Ưu đãi đang có tại GlowSkin 🎉:\n\n• Miễn phí vận chuyển đơn từ 300K\n• Giảm 10% cho thành viên mới\n• Flash Sale mỗi ngày từ 12h-14h\n\nBạn có thể xem thêm tại trang Khuyến Mãi nhé!";
  }
  if (msg.includes("da dầu") || msg.includes("da nhờn")) {
    return "Với da dầu, mình gợi ý routine 🧴:\n\n1. Sữa Rửa Mặt Dịu Nhẹ — làm sạch không gây khô\n2. Toner Cân Bằng Da — se khít lỗ chân lông\n3. Serum Vitamin C — kiểm soát dầu, sáng da\n4. Kem Chống Nắng SPF50+ — nhẹ, không nhờn\n\nBạn muốn mình gửi link sản phẩm không?";
  }
  if (msg.includes("da khô")) {
    return "Với da khô, mình gợi ý routine 💧:\n\n1. Sữa Rửa Mặt Dịu Nhẹ — không gây khô căng\n2. Kem Dưỡng Ẩm Hyaluronic Acid — cấp ẩm 72h\n3. Mặt Nạ Collagen — phục hồi tức thì\n4. Kem Dưỡng Mắt Chống Lão Hóa — dưỡng vùng mắt\n\nBạn muốn xem chi tiết sản phẩm nào?";
  }
  if (msg.includes("xin chào") || msg.includes("hello") || msg.includes("hi") || msg.includes("chào")) {
    return "Chào bạn! 😊 Rất vui được hỗ trợ bạn. Mình có thể giúp bạn tìm sản phẩm phù hợp, tư vấn chăm sóc da, hoặc giải đáp thắc mắc. Bạn cần gì nào?";
  }
  if (msg.includes("cảm ơn") || msg.includes("thank")) {
    return "Không có gì ạ! 😊 Nếu cần thêm gì, đừng ngại nhắn cho mình nhé. Chúc bạn có trải nghiệm mua sắm vui vẻ tại GlowSkin! 💕";
  }
  if (msg.includes("giá") || msg.includes("bao nhiêu")) {
    return "Bạn muốn hỏi giá sản phẩm nào ạ? Một số mức giá tham khảo:\n\n• Serum Vitamin C: 450.000₫\n• Kem Dưỡng Ẩm: 380.000₫\n• Sữa Rửa Mặt: 250.000₫\n• Kem Chống Nắng: 320.000₫\n• Son Môi Lì: 280.000₫\n\nBạn cho mình biết tên sản phẩm cụ thể nhé!";
  }

  return "Cảm ơn bạn đã nhắn tin! 😊 Mình sẽ hỗ trợ bạn ngay. Bạn có thể cho mình biết thêm chi tiết không? Hoặc chọn một trong các chủ đề:\n\n• Tư vấn chăm sóc da\n• Sản phẩm bán chạy\n• Kiểm tra đơn hàng\n• Chính sách đổi trả";
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME_CONTENT,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      const delay = 600 + Math.random() * 800;
      setTimeout(() => {
        const reply: Message = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: generateAutoReply(trimmed),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, reply]);
        setIsTyping(false);
      }, delay);
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Chat Panel */}
      <div
        className={cn(
          "fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[min(520px,calc(100vh-8rem))] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right",
          isOpen
            ? "scale-100 opacity-100 translate-y-0 pointer-events-auto"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-primary-hover">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bot className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-primary-foreground font-semibold text-sm leading-tight">
                GlowSkin Assistant
              </h3>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-primary-foreground/70 text-[11px]">
                  Online
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Đóng chat"
          >
            <X className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md shadow-sm"
                )}
              >
                <p className="whitespace-pre-line">{msg.content}</p>
                <span
                  className={cn(
                    "block text-[10px] mt-1",
                    msg.role === "user"
                      ? "text-primary-foreground/60"
                      : "text-muted-foreground"
                  )}
                >
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2 justify-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies (show only when few messages) */}
        {messages.length <= 1 && (
          <div className="px-4 py-2 border-t border-border/50 bg-card">
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map((text) => (
                <button
                  key={text}
                  onClick={() => handleQuickReply(text)}
                  className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-3 py-2.5 border-t border-border bg-card"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-muted/50 border border-border/50 rounded-full px-4 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={cn(
              "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all",
              input.trim() && !isTyping
                ? "bg-primary text-primary-foreground hover:bg-primary-hover shadow-md"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            aria-label="Gửi tin nhắn"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95",
          isOpen
            ? "bg-muted text-muted-foreground hover:bg-muted/80"
            : "bg-primary text-primary-foreground hover:bg-primary-hover"
        )}
        aria-label={isOpen ? "Đóng chat" : "Mở chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </>
        )}
      </button>
    </>
  );
}
