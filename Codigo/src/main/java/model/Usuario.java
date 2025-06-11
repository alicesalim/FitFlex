package model;


public class Usuario {

    private int id;
    private String nome;
    private String email;
    private String senha;
    private byte[] imagemPerfil; 

    // Construtores
    public Usuario() {
        this.id = -1;
        this.nome = "";
        this.email = "";
        this.senha = "";
        this.imagemPerfil = null;
    }

    public Usuario(String nome, String email, String senha) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.imagemPerfil = null;
    }

    public Usuario(int id, String nome, String email, String senha, byte[] imagemPerfil) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.imagemPerfil = imagemPerfil;
    }

    public Usuario(String nome, String email, String senha, byte[] imagemPerfil) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.imagemPerfil = imagemPerfil;
    }

    // Getters e Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public byte[] getImagemPerfil() {
        return imagemPerfil;
    }

    public void setImagemPerfil(byte[] imagemPerfil) {
        this.imagemPerfil = imagemPerfil;
    }

    @Override
    public String toString() {
        return "Usuario [id=" + id + 
               ", nome=" + nome + 
               ", email=" + email + 
               ", senha=" + senha + "]";
    }
}
