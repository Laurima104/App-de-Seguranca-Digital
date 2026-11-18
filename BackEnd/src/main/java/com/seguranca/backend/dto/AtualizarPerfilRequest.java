package com.seguranca.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AtualizarPerfilRequest(
        @NotBlank(message = "Nome de exibição é obrigatório")
        @Size(max = 120, message = "Nome de exibição deve ter no máximo 120 caracteres")
        String displayName,

        @NotBlank(message = "Nickname é obrigatório")
        @Size(max = 60, message = "Nickname deve ter no máximo 60 caracteres")
        String nickname
) {}
