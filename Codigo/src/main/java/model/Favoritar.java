package model;

public class Favoritar {
    private int usuario_id;
    private int receita_id;

    public Favoritar(int usuario_id, int receita_id) {
        this.usuario_id = usuario_id;
        this.receita_id = receita_id;
    }

    public int getUserId() {
        return usuario_id;
    }

    public void setUserId(int usuario_id) {
        this.usuario_id = usuario_id;
    }

    public int getReceitaId() {
        return receita_id;
    }

    public void setReceitaId(int receita_id) {
        this.receita_id = receita_id;
    }

    @Override
    public String toString() {
        return "Favoritar [Ingrediente_ID=" + usuario_id + ", Receitas_ID=" + receita_id + "]";
    }
}
