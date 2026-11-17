package com.seguranca.backend.dto;

import jakarta.validation.constraints.NotBlank;


public record LoginRequest(
        @NotBlank(message = "E-mail é obrigatório")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        String senha
) {}