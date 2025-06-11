package model;

// Classe que representa um usuário do sistema
public class Ingrediente {
    // Atributos privados para encapsulamento
    private int id;
    private String nome;
    private double gordura;
    private double carbo;
    private double cal;         
    private double proteinas;   
    private double quantidade;
    private double indice_glicemico;
    private String unidade;

    // Construtor padrão (valores iniciais)
    public Ingrediente() {
        this.id = -1;
        this.nome = "";
        this.gordura = -1;
        this.carbo = -1; 
        this.cal = -1;
        this.proteinas = -1;
        this.quantidade = -1;
        this.indice_glicemico = -1;
        this.unidade = "";
    }

    // Construtor completo com todos os atributos
    public Ingrediente(int id, String nome, double gordura, double carbo, double cal, double proteinas, double quantidade, double indiceGlicemico, String unidade) {
        this.id = id;
        this.nome = nome;
        this.quantidade = quantidade;
        this.proteinas = proteinas;
        this.carbo = carbo;
        this.gordura = gordura;
        this.cal = cal;
        this.indice_glicemico = indiceGlicemico;
        this.unidade = unidade;

    }

    public Ingrediente( String nome, double gordura, double carbo, double cal, double proteinas, double quantidade, double indiceGlicemico, String unidade) {
        this.nome = nome;
        this.quantidade = quantidade;
        this.proteinas = proteinas;
        this.carbo = carbo;
        this.gordura = gordura;
        this.cal = cal;
        this.indice_glicemico = indiceGlicemico;
        this.unidade = unidade;

    }

    // Métodos getters e setters

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

    public double getGordura() {
        return gordura;
    }

    public void setGordura(double gordura) {
        this.gordura = gordura;
    }

    public double getCarbo() {
        return carbo;
    }

    public void setCarbo(double carbo) {
        this.carbo = carbo;
    }

    public double getCal() {
        return cal;
    }

    public void setCal(double cal) {
        this.cal = cal;
    }

    public double getProteinas() {
        return proteinas;
    }

    public void setProteinas(double proteinas) {
        this.proteinas = proteinas;
    }

    public double getQuantidade(){
        return quantidade;
    }

    public void setQuantidade(double quantidade){
        this.quantidade = quantidade;
    }

    public double getIndiceGlicemico() {
        return indice_glicemico;
    }

    public void setIndiceGlicemico(double indiceGlicemico) {
        this.indice_glicemico = indiceGlicemico;
    }

    public String getUnidade(){
        return unidade;
    }

    public void setUnidade(String unidade){
        this.unidade = unidade;
    }

    @Override
    public String toString() {
        return "Ingrediente [ id = " + id + 
               ", nome = " + nome + 
               ", gordura = " + gordura + 
               ", carboidratos = " + carbo + 
               ", calorias = " + cal + 
               ", proteinas = " + proteinas + 
               ", quantidade = " + quantidade + 
               ", indiceGlicemico = " + indice_glicemico +
               ", unidade = " + unidade + " ]";
    }
}