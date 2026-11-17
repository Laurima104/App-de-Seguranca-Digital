package com.seguranca.backend.dto;

import com.seguranca.backend.model.Usuario;

// O que a API devolve ao front.
public record UsuarioResponse(Long id, String nickname, String email, int progresso) {

    // Converte a entidade do banco para a resposta
    public static UsuarioResponse de(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNickname(), u.getEmail(), u.getProgresso());
    }
}