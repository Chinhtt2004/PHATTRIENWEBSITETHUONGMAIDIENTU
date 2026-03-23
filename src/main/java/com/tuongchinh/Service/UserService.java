package com.tuongchinh.Service;

import com.tuongchinh.DTO.ChangePasswordRequest;
import com.tuongchinh.DTO.RegisterRequest;
import com.tuongchinh.DTO.UserRequest;
import com.tuongchinh.Entity.Cart;
import com.tuongchinh.Entity.User;
import com.tuongchinh.Repository.CartRepository;
import com.tuongchinh.Repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private CartRepository cartRepository;
    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }
        return jwtService.generateToken(user.getEmail());
    }
    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email đã tồn tại";
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        Cart cart=new Cart();
        cart.setUser(user);
        userRepository.save(user);
        cartRepository.save(cart);
        return "Đăng ký thành công";
    }
    public User findByEmail(String email){
        return userRepository.findByEmail(email).orElse(null);
    }
    public User findById(Long id){
        return userRepository.findById(id).orElse(null);
    }
    public String extractToken(HttpServletRequest request) {

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        throw new RuntimeException("Token not found in cookies");
    }
    public User updateProfile(Long userId, UserRequest request){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());
        user.setPhone(request.getPhone());
        return userRepository.save(user);
    }
    public void changePassword(Long userId, ChangePasswordRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Password confirmation not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }
}