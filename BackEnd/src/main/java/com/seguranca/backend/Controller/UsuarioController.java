package com.seguranca.backend.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.seguranca.backend.dto.CadastroRequest;
import com.seguranca.backend.dto.AtualizarPerfilRequest;
import com.seguranca.backend.dto.AlterarSenhaRequest;
import com.seguranca.backend.dto.LoginResponse;
import com.seguranca.backend.dto.LoginRequest;
import com.seguranca.backend.dto.UsuarioResponse;
import com.seguranca.backend.service.AuthService;
import com.seguranca.backend.service.SessionService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin
public class UsuarioController {

    private final AuthService service;
    private final SessionService sessions;

    public UsuarioController(AuthService service, SessionService sessions) {
        this.service = service;
        this.sessions = sessions;
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioResponse> cadastrar(@Valid @RequestBody CadastroRequest dados) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrar(dados));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest dados) {
        return ResponseEntity.ok(service.login(dados));
    }

    @GetMapping("/usuarios/me")
    public ResponseEntity<UsuarioResponse> perfil(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return ResponseEntity.ok(UsuarioResponse.de(sessions.requireUser(authorization)));
    }

    @PatchMapping("/usuarios/me")
    public ResponseEntity<UsuarioResponse> atualizarPerfil(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @Valid @RequestBody AtualizarPerfilRequest dados) {
        return ResponseEntity.ok(service.atualizarPerfil(sessions.requireUser(authorization), dados));
    }

    @PutMapping("/usuarios/me/senha")
    public ResponseEntity<Void> alterarSenha(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @Valid @RequestBody AlterarSenhaRequest dados) {
        service.alterarSenha(sessions.requireUser(authorization), dados);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> sair(@RequestHeader(value = "Authorization", required = false) String authorization) {
        sessions.revoke(authorization);
        return ResponseEntity.noContent().build();
    }
}
