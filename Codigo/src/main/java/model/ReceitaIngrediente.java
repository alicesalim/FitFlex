package model;

public class ReceitaIngrediente {
    private int ingredienteId;
    private int receitaId;
    private double quantidade;

    public ReceitaIngrediente(int ingredienteId, int receitaId, double quantidade) {
        this.ingredienteId = ingredienteId;
        this.receitaId = receitaId;
        this.quantidade = quantidade;
    }

    public int getIngredienteId() {
        return ingredienteId;
    }

    public void setIngredienteId(int ingredienteId) {
        this.ingredienteId = ingredienteId;
    }

    public int getReceitaId() {
        return receitaId;
    }

    public void setReceitaId(int receitaId) {
        this.receitaId = receitaId;
    }

    public double getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(double quantidade) {
        this.quantidade = quantidade;
    }

    @Override
    public String toString() {
        return "ReceitaIngrediente [Ingrediente_ID=" + ingredienteId + ", Receitas_ID=" + receitaId + ", Quantidade=" + quantidade + "]";
    }
}
