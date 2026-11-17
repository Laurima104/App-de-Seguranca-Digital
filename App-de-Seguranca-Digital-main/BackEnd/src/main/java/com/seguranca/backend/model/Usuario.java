package com.seguranca.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    @Column(nullable = false)
    private String nickname;

    
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    
    private int progresso = 0;

   
    public Usuario() {}

    public Usuario(String nickname, String email, String senha) {
        this.nickname = nickname;
        this.email = email;
        this.senha = senha;
    }

    public Long getId() { return id; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public int getProgresso() { return progresso; }
    public void setProgresso(int progresso) { this.progresso = progresso; }
}