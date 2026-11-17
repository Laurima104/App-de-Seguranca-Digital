package com.seguranca.backend.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.seguranca.backend.dto.CadastroRequest;
import com.seguranca.backend.dto.LoginRequest;
import com.seguranca.backend.dto.UsuarioResponse;
import com.seguranca.backend.service.AuthService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin
public class UsuarioController {

    private final AuthService service;

    public UsuarioController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioResponse> cadastrar(@Valid @RequestBody CadastroRequest dados) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrar(dados));
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@Valid @RequestBody LoginRequest dados) {
        return ResponseEntity.ok(service.login(dados));
    }
}