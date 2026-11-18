package com.seguranca.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(nullable = false)
    private String nickname;

    
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, length = 255)
    private String senha;

    @Column(name = "terms_accepted_at", nullable = false)
    private LocalDateTime termsAcceptedAt;

    
    private int progresso = 0;

   
    public Usuario() {}

    public Usuario(String displayName, String nickname, String email, String senha, LocalDateTime termsAcceptedAt) {
        this.displayName = displayName;
        this.nickname = nickname;
        this.email = email;
        this.senha = senha;
        this.termsAcceptedAt = termsAcceptedAt;
    }

    public Long getId() { return id; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public int getProgresso() { return progresso; }
    public void setProgresso(int progresso) { this.progresso = progresso; }
    public LocalDateTime getTermsAcceptedAt() { return termsAcceptedAt; }
}
