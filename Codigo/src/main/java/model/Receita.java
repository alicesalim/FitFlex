package model;

public class Receita {
    private int id;
    private String nome;
    private String modoPreparo;
    private byte[] imagemReceita;

    public Receita() {
        this.id = -1;
        this.nome = "";
        this.modoPreparo = "";
        this.imagemReceita = null;
    }

    public Receita(int id, String nome, String modoPreparo, byte[] imagemReceita) {
        this.id = id;
        this.nome = nome;
        this.modoPreparo = modoPreparo;
        this.imagemReceita = imagemReceita;
    }

    public Receita(String nome, String modoPreparo, byte[] imagemReceita) {
        this.nome = nome;
        this.modoPreparo = modoPreparo;
        this.imagemReceita = imagemReceita;
    }


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

    public String getModoPreparo() {
        return modoPreparo;
    }

    public void setModoPreparo(String modoPreparo) {
        this.modoPreparo = modoPreparo;
    }

    public byte[] getImagemReceita() {
        return imagemReceita;
    }

    public void setImagemReceita(byte[] imagemReceita) {
        this.imagemReceita = imagemReceita;
    }

    @Override
    public String toString() {
        return "Receita [ID=" + id + ", Nome=" + nome + ", Modo de Preparo=" + modoPreparo + "]";
    }
}
