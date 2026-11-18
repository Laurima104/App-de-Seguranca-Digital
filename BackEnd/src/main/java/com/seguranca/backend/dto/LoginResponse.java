package com.seguranca.backend.dto;

public record LoginResponse(UsuarioResponse user, String accessToken) {}
