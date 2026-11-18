package com.seguranca.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.AssertTrue;


public record CadastroRequest(
        @NotBlank(message = "Nome de exibição é obrigatório")
        String displayName,

        @NotBlank(message = "Nickname é obrigatório")
        String nickname,

        @NotBlank(message = "E-mail é obrigatório")
        @Email(message = "E-mail inválido")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 8, message = "A senha deve ter pelo menos 8 caracteres")
        String senha,

        @AssertTrue(message = "É necessário aceitar os documentos institucionais")
        boolean acceptedTerms
) {}
