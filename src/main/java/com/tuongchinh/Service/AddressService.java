package com.tuongchinh.Service;

import com.tuongchinh.DTO.AddressRequest;
import com.tuongchinh.DTO.AddressResponse;
import com.tuongchinh.Entity.Address;
import com.tuongchinh.Entity.User;
import com.tuongchinh.Repository.AddressRepository;
import com.tuongchinh.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    // Lấy tất cả địa chỉ
    public List<AddressResponse> getAddresses(Long userId) {
        return addressRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Thêm địa chỉ mới
    public void addAddress(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            removeCurrentDefault(userId);
        }

        Address address = new Address();
        address.setUser(user);
        address.setReceiverName(request.getReceiverName());
        address.setPhone(request.getPhone());
        address.setAddress(request.getAddress());
        address.setIsDefault(request.getIsDefault());
        addressRepository.save(address);
    }

    // Sửa địa chỉ
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ"));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Không có quyền sửa địa chỉ này");
        }

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            removeCurrentDefault(userId);
        }

        address.setReceiverName(request.getReceiverName());
        address.setPhone(request.getPhone());
        address.setAddress(request.getAddress());
        address.setIsDefault(request.getIsDefault());

        return mapToResponse(addressRepository.save(address));
    }

    // Xóa địa chỉ
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ"));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Không có quyền xóa địa chỉ này");
        }

        addressRepository.delete(address);
    }

    // Set địa chỉ mặc định
    public AddressResponse setDefault(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ"));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Không có quyền thay đổi địa chỉ này");
        }

        removeCurrentDefault(userId);
        address.setIsDefault(true);
        return mapToResponse(addressRepository.save(address));
    }

    // Lấy địa chỉ mặc định hoặc theo id
    public Address resolveAddress(Long userId, Long addressId) {
        if (addressId != null) {
            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ"));
            if (!address.getUser().getId().equals(userId)) {
                throw new RuntimeException("Địa chỉ không hợp lệ");
            }
            return address;
        }
        return addressRepository.findByUserIdAndIsDefaultTrue(userId)
                .orElseThrow(() -> new RuntimeException("Vui lòng chọn địa chỉ giao hàng"));
    }

    // Bỏ mặc định địa chỉ cũ
    private void removeCurrentDefault(Long userId) {
        addressRepository.findByUserIdAndIsDefaultTrue(userId)
                .ifPresent(a -> {
                    a.setIsDefault(false);
                    addressRepository.save(a);
                });
    }

    private AddressResponse mapToResponse(Address address) {
        AddressResponse res = new AddressResponse();
        res.setId(address.getId());
        res.setReceiverName(address.getReceiverName());
        res.setPhone(address.getPhone());
        res.setAddress(address.getAddress());
        res.setIsDefault(address.getIsDefault());
        return res;
    }
}