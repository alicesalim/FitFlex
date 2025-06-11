package dao;

import java.sql.*;
import java.security.*;
import java.math.*;

public class DAO {
    protected Connection conexao;

    public DAO() {
        conexao = null;
    }

    public boolean conectar() {
        String driverName = "org.postgresql.Driver";  
        String serverName = "ti2ff.postgres.database.azure.com";  
        int porta = 5432;  
        String mydatabase = "postgres"; 
        String url = "jdbc:postgresql://" + serverName + ":" + porta + "/" + mydatabase;
        String username = "adminFitFlex";  
        String password = "senha#10"; 

        boolean status = false;

        try {
            // Carregar o driver PostgreSQL
            Class.forName(driverName);
            // Estabelecer a conexão com o banco
            conexao = DriverManager.getConnection(url, username, password);
            status = (conexao != null);
            System.out.println("Conexão efetuada com o PostgreSQL na Azure!");
        } catch (ClassNotFoundException e) { 
            System.err.println("Conexão NÃO efetuada com o PostgreSQL -- Driver não encontrado -- " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("Conexão NÃO efetuada com o PostgreSQL -- " + e.getMessage());
        }

        return status;
    }

    public boolean close() {
        boolean status = false;

        try {
            if (conexao != null && !conexao.isClosed()) {
                conexao.close();
                status = true;
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
        return status;
    }
	public static void main(String[] args) {
        DAO dao = new DAO();
        dao.conectar(); // Testa a conexão

        // Fechar a conexão após o teste
        dao.close();
    }
}