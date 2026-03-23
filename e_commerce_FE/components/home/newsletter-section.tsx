"use client";

import React from "react"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Đăng ký thành công!", {
      description: "Cảm ơn bạn đã đăng ký nhận tin từ GlowSkin.",
    });
    
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <section className="relative py-10 lg:py-16 bg-gradient-to-br from-primary via-rose-400/90 to-primary-hover overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-rose-300/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-10 text-white/5 text-8xl font-serif pointer-events-none select-none hidden lg:block">✿</div>
      <div className="absolute bottom-8 left-10 text-white/5 text-6xl font-serif pointer-events-none select-none hidden lg:block">♡</div>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10">
            <Mail className="h-8 w-8 text-white" />
          </div>
          
          {/* Content */}
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Nhận Ưu Đãi Độc Quyền
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Đăng ký nhận bản tin để cập nhật xu hướng làm đẹp mới nhất và nhận ngay voucher giảm 10% cho đơn hàng đầu tiên.
          </p>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white"
              required
            />
            <Button
              type="submit"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Đang xử lý..."
              ) : (
                <>
                  Đăng ký
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          
          {/* Privacy note */}
          <p className="text-white/60 text-sm mt-4">
            Chúng tôi tôn trọng quyền riêng tư của bạn. Hủy đăng ký bất cứ lúc nào.
          </p>
        </div>
      </div>
    </section>
  );
}
