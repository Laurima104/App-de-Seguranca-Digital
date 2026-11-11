package com.seguranca.backend.service;

import com.seguranca.backend.dto.CadastroRequest;
import com.seguranca.backend.dto.LoginRequest;
import com.seguranca.backend.dto.UsuarioResponse;
import com.seguranca.backend.model.Usuario;
import com.seguranca.backend.Repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UsuarioRepository repository;

    public AuthService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public UsuarioResponse cadastrar(CadastroRequest dados) {
        // Regra: e-mail não pode se repetir (erro 409 = conflito)
        if (repository.existsByEmail(dados.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }

        Usuario novo = new Usuario(dados.nickname(), dados.email(), dados.senha());
        Usuario salvo = repository.save(novo); // salva no banco
        return UsuarioResponse.de(salvo);
    }

    public UsuarioResponse login(LoginRequest dados) {
        // Busca o usuário pelo e-mail; se não achar, erro 401 (não autorizado)
        Usuario usuario = repository.findByEmail(dados.email())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos"));

        // Compara a senha digitada com a salva no banco
        if (!usuario.getSenha().equals(dados.senha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos");
        }

        return UsuarioResponse.de(usuario);
    }
}