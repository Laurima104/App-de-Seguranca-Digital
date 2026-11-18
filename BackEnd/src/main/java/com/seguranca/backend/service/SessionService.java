package com.seguranca.backend.service;

import com.seguranca.backend.Repository.UsuarioSessaoRepository;
import com.seguranca.backend.model.Usuario;
import com.seguranca.backend.model.UsuarioSessao;
import org.hibernate.Hibernate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class SessionService {
    private static final int TOKEN_BYTES = 32;
    private static final int SESSION_DAYS = 30;

    private final UsuarioSessaoRepository repository;
    private final SecureRandom secureRandom = new SecureRandom();

    public SessionService(UsuarioSessaoRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public String create(Usuario usuario) {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        repository.save(new UsuarioSessao(usuario, hash(token), LocalDateTime.now().plusDays(SESSION_DAYS)));
        return token;
    }

    @Transactional(readOnly = true)
    public Usuario requireUser(String authorization) {
        String token = bearerToken(authorization);
        UsuarioSessao session = repository.findByTokenHashAndExpiraEmAfter(hash(token), LocalDateTime.now())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessão inválida ou expirada"));
        Usuario usuario = session.getUsuario();
        Hibernate.initialize(usuario);
        return usuario;
    }

    @Transactional
    public void revoke(String authorization) {
        repository.deleteByTokenHash(hash(bearerToken(authorization)));
    }

    private static String bearerToken(String authorization) {
        if (authorization == null || !authorization.regionMatches(true, 0, "Bearer ", 0, 7)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Autenticação necessária");
        }
        String token = authorization.substring(7).trim();
        if (token.isEmpty()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Autenticação necessária");
        return token;
    }

    private static String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 não está disponível", exception);
        }
    }
}
