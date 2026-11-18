package com.seguranca.backend.service;

import com.seguranca.backend.dto.CadastroRequest;
import com.seguranca.backend.dto.LoginResponse;
import com.seguranca.backend.dto.LoginRequest;
import com.seguranca.backend.dto.AtualizarPerfilRequest;
import com.seguranca.backend.dto.AlterarSenhaRequest;
import com.seguranca.backend.dto.UsuarioResponse;
import com.seguranca.backend.model.Usuario;
import com.seguranca.backend.Repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final SessionService sessions;

    public AuthService(UsuarioRepository repository, PasswordEncoder passwordEncoder, SessionService sessions) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.sessions = sessions;
    }

    public UsuarioResponse cadastrar(CadastroRequest dados) {
        // Regra: e-mail não pode se repetir (erro 409 = conflito)
        String email = dados.email().trim().toLowerCase();
        if (repository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }

        Usuario novo = new Usuario(
                dados.displayName().trim(),
                dados.nickname().trim(),
                email,
                passwordEncoder.encode(dados.senha()),
                LocalDateTime.now());
        Usuario salvo = repository.save(novo); // salva no banco
        return UsuarioResponse.de(salvo);
    }

    public LoginResponse login(LoginRequest dados) {
        // Busca o usuário pelo e-mail; se não achar, erro 401 (não autorizado)
        Usuario usuario = repository.findByEmail(dados.email().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos"));

        // Compara a senha digitada com a salva no banco
        if (!passwordEncoder.matches(dados.senha(), usuario.getSenha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos");
        }

        return new LoginResponse(UsuarioResponse.de(usuario), sessions.create(usuario));
    }

    public UsuarioResponse atualizarPerfil(Usuario usuarioAutenticado, AtualizarPerfilRequest dados) {
        usuarioAutenticado.setDisplayName(dados.displayName().trim());
        usuarioAutenticado.setNickname(dados.nickname().trim());
        return UsuarioResponse.de(repository.save(usuarioAutenticado));
    }

    public void alterarSenha(Usuario usuarioAutenticado, AlterarSenhaRequest dados) {
        if (!passwordEncoder.matches(dados.senhaAtual(), usuarioAutenticado.getSenha())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A senha atual não confere");
        }
        if (passwordEncoder.matches(dados.novaSenha(), usuarioAutenticado.getSenha())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A nova senha deve ser diferente da atual");
        }
        usuarioAutenticado.setSenha(passwordEncoder.encode(dados.novaSenha()));
        repository.save(usuarioAutenticado);
    }
}
