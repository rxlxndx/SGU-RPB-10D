package com.example.server;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }

    @Transactional
    public User createUser(User user) {
        if (userRepository.existsByCorreo(user.getCorreo())) {
            throw new RuntimeException("Ya existe un usuario con el correo: " + user.getCorreo());
        }
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);

        // Verificar si el correo ya existe y no es del usuario actual
        if (!user.getCorreo().equals(userDetails.getCorreo()) &&
                userRepository.existsByCorreo(userDetails.getCorreo())) {
            throw new RuntimeException("Ya existe un usuario con el correo: " + userDetails.getCorreo());
        }

        user.setNombre(userDetails.getNombre());
        user.setCorreo(userDetails.getCorreo());
        user.setTelefono(userDetails.getTelefono());

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}
