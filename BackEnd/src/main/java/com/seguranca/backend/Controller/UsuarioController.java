package com.seguranca.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.seguranca.backend.Repository.UsuarioRepository;
import com.seguranca.backend.model.Usuario;

@RestController
@CrossOrigin
public class UsuarioController {

    private final UsuarioRepository repository;
    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/usuarios")
    public ResponseEntity<?> cadastrar(@RequestBody Usuario novo) {

        if (repository.findByEmail(novo.getEmail()) != null) {
            return ResponseEntity.status(409).body("E-mail já cadastrado");
        }

        return ResponseEntity.status(201).body(repository.save(novo));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario dados) {

        Usuario usuario = repository.findByEmail(dados.getEmail());

        if (usuario == null || !usuario.getSenha().equals(dados.getSenha())) {
            return ResponseEntity.status(401).body("E-mail ou senha inválidos");
        }

        return ResponseEntity.ok(usuario);
    }
}