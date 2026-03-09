package com.tuongchinh.Service;

import com.tuongchinh.DTO.RegisterRequest;
import com.tuongchinh.Entity.Cart;
import com.tuongchinh.Entity.User;
import com.tuongchinh.Repository.CartRepository;
import com.tuongchinh.Repository.UserRepository;
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
    CartRepository cartRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
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

        user.setRole("USER");
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
}