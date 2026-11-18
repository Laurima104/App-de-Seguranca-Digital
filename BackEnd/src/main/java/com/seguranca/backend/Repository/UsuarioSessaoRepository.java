package com.seguranca.backend.Repository;

import com.seguranca.backend.model.UsuarioSessao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UsuarioSessaoRepository extends JpaRepository<UsuarioSessao, Long> {
    Optional<UsuarioSessao> findByTokenHashAndExpiraEmAfter(String tokenHash, LocalDateTime agora);
    void deleteByTokenHash(String tokenHash);
}
