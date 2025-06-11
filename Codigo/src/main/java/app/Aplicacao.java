package app;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;
import java.net.URL;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import utils.EmailUtil;
import model.Favoritar;
import model.Avaliar;
import model.Ingrediente;
import model.Receita;
import model.ReceitaDTO;
import model.ReceitaIngrediente;
import model.Usuario;
import model.UsuarioDTO;
import service.FavoritarService;
import service.IngredienteService;
import service.ReceitaIngredienteService;
import service.ReceitaService;
import service.AvaliarService;
import service.UserService;
import java.util.Base64;
import static spark.Spark.before;
import static spark.Spark.delete;
import static spark.Spark.get;
import static spark.Spark.options;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.put;
import static spark.Spark.staticFiles;
import io.github.cdimascio.dotenv.Dotenv;

public class Aplicacao {
    public static void main(String[] args) {
        port(4567);
        staticFiles.location("/public");
        Dotenv dotenv = Dotenv.load(); // Carrega o .env
        enableCORS("*", "*", "*");

        IngredienteService ingredienteService = new IngredienteService();
        UserService usuarioService = new UserService();
        ReceitaService receitaService = new ReceitaService(); // <-- Instancia ReceitaService
        ReceitaIngredienteService receitaIngredienteService = new ReceitaIngredienteService(); // <-- Instancia
                                                                                               // ReceitaService
        FavoritarService favoritarService = new FavoritarService(); // <-- Instancia FavoritarService
        AvaliarService avaliarService = new AvaliarService(); // <-- Instancia FavoritarService
        Gson gson = new Gson();

        post("/analisar-imagem", (req, res) -> {
            res.type("application/json");

            // Configura o suporte a multipart/form-data
            MultipartConfigElement multipartConfigElement = new MultipartConfigElement("/tmp");
            req.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement);

            try {
                Part filePart = req.raw().getPart("file");
                InputStream fileInputStream = filePart.getInputStream();
                byte[] imageBytes = fileInputStream.readAllBytes();

                // Configurações da API da Azure
                String subscriptionKey = dotenv.get("API_KEY");
                String endpoint = "https://fitflexai.cognitiveservices.azure.com/";
                String url = endpoint + "vision/v3.2/read/analyze";

                // Envia a imagem para a API da Azure
                URI uri = new URI(url);
                HttpURLConnection connection = (HttpURLConnection) uri.toURL().openConnection();
                connection.setRequestMethod("POST");
                connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
                connection.setRequestProperty("Content-Type", "application/octet-stream");
                connection.setDoOutput(true);
                connection.getOutputStream().write(imageBytes);

                if (connection.getResponseCode() != 202) {
                    res.status(500);
                    return "{\"erro\":\"Erro ao enviar imagem para análise.\"}";
                }

                // Obtém a URL de operação para verificar o status
                String operationLocation = connection.getHeaderField("operation-location");

                // Aguarda a conclusão da análise
                String result = null;
                for (int i = 0; i < 10; i++) {
                    Thread.sleep(1000);
                    HttpURLConnection resultConnection = (HttpURLConnection) new URL(operationLocation)
                            .openConnection();
                    resultConnection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);

                    InputStream resultStream = resultConnection.getInputStream();
                    String jsonResponse = new String(resultStream.readAllBytes());
                    JsonObject json = JsonParser.parseString(jsonResponse).getAsJsonObject();

                    if ("succeeded".equals(json.get("status").getAsString())) {
                        result = jsonResponse;
                        break;
                    }
                }

                if (result == null) {
                    res.status(500);
                    return "{\"erro\":\"Análise não concluída a tempo.\"}";
                }

                return result;

            } catch (Exception e) {
                res.status(500);
                return "{\"erro\":\"Erro ao processar a imagem.\"}";
            }
        });

        // Rotas Ingrediente (mantidas)
        post("/ingrediente", (req, res) -> {
            res.type("application/json");
            Ingrediente ingrediente = gson.fromJson(req.body(), Ingrediente.class);
            boolean sucesso = ingredienteService.cadastrarIngrediente(ingrediente);
            if (sucesso) {
                res.status(201);
                return gson.toJson(ingrediente);
            } else {
                res.status(500);
                return "{\"erro\":\"Erro ao adicionar ingrediente.\"}";
            }
        });
        get("/ingrediente", (req, res) -> {
            res.type("application/json");
            List<Ingrediente> ingredientes = ingredienteService.listarTodosIngredientes();
            return gson.toJson(ingredientes);
        });
        put("/ingrediente/:id", (req, res) -> {
            res.type("application/json");
            int id = Integer.parseInt(req.params(":id"));
            Ingrediente ingredienteAtualizado = gson.fromJson(req.body(), Ingrediente.class);
            ingredienteAtualizado.setId(id);
            boolean sucesso = ingredienteService.atualizarIngrediente(ingredienteAtualizado);
            if (sucesso) {
                return gson.toJson(ingredienteAtualizado);
            } else {
                res.status(500);
                return "{\"erro\":\"Erro ao atualizar ingrediente.\"}";
            }
        });
        delete("/ingrediente/:id", (req, res) -> {
            res.type("application/json");
            int id = Integer.parseInt(req.params(":id"));
            boolean sucesso = ingredienteService.excluirIngrediente(id);
            if (sucesso) {
                return "{\"mensagem\":\"Ingrediente removido com sucesso.\"}";
            } else {
                res.status(404);
                return "{\"erro\":\"Ingrediente não encontrado.\"}";
            }
        });
        get("/ingrediente/:id", (req, res) -> {
            res.type("application/json");
            int id = Integer.parseInt(req.params(":id"));
            Ingrediente ingrediente = ingredienteService.buscarIngredientePorId(id);
            if (ingrediente != null) {
                return gson.toJson(ingrediente);
            } else {
                res.status(404);
                return "{\"erro\":\"Ingrediente não encontrado.\"}";
            }
        });

        // Rotas Usuario (mantidas)
        post("/usuario", (req, res) -> {
            res.type("application/json");
            try {
                UsuarioDTO usuarioDTO = gson.fromJson(req.body(), UsuarioDTO.class);

                Usuario usuario = new Usuario();
                usuario.setNome(usuarioDTO.getNome());
                usuario.setEmail(usuarioDTO.getEmail());
                usuario.setSenha(usuarioDTO.getSenha());

                if (usuarioDTO.getImagemBase64() != null && !usuarioDTO.getImagemBase64().isEmpty()) {
                    byte[] imagemBytes = Base64.getDecoder().decode(usuarioDTO.getImagemBase64());
                    usuario.setImagemPerfil(imagemBytes);
                }

                boolean sucesso = usuarioService.cadastrarUsuario(usuario);
                if (sucesso) {
                    res.status(201);
                    return gson.toJson(usuario);
                } else {
                    res.status(500);
                    return "{\"erro\":\"Erro ao adicionar usuário.\"}";
                }
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        post("/usuario/login", (req, res) -> {
            res.type("application/json");
            Usuario loginReq = gson.fromJson(req.body(), Usuario.class);
            Usuario usuario = usuarioService.autenticarUsuario(loginReq.getEmail(), loginReq.getSenha());
            if (usuario != null) {
                System.out.println(gson.toJson(usuario));
                return gson.toJson(usuario);
            } else {
                res.status(401);
                return "{\"erro\":\"Email ou senha incorretos.\"}";
            }
        });

        get("/usuario/:id", (req, res) -> {
            res.type("application/json");
            int id = Integer.parseInt(req.params(":id"));
            Usuario usuario = usuarioService.buscarUsuarioId(id);
            if (usuario != null) {
                return gson.toJson(usuario);
            } else {
                res.status(404);
                return "{\"erro\":\"Usuário não encontrado.\"}";
            }
        });

        get("/usuario", (req, res) -> {
            res.type("application/json");
            List<Usuario> usuarios = usuarioService.listarTodosUsuarios();
            return gson.toJson(usuarios);
        });

        put("/usuario/:id", (req, res) -> {
            res.type("application/json");
            try {
                int id = Integer.parseInt(req.params(":id"));

                // Usar UsuarioDTO para receber os dados, igual ao POST
                UsuarioDTO usuarioDTO = gson.fromJson(req.body(), UsuarioDTO.class);

                // Buscar o usuário atual para manter dados que não foram atualizados
                Usuario usuarioExistente = usuarioService.buscarUsuarioId(id);
                if (usuarioExistente == null) {
                    res.status(404);
                    return "{\"erro\":\"Usuário não encontrado.\"}";
                }

                // Atualizar os campos
                usuarioExistente.setNome(usuarioDTO.getNome());
                // Email não é atualizado por segurança
                usuarioExistente.setSenha(usuarioDTO.getSenha());

                // Processar a imagem
                if (usuarioDTO.getImagemBase64() != null) {
                    if (usuarioDTO.getImagemBase64().isEmpty()) {
                        // Se a string estiver vazia, isso significa que a imagem deve ser removida
                        usuarioExistente.setImagemPerfil(null);
                    } else {
                        // Caso contrário, decodifica a imagem base64
                        byte[] imagemBytes = Base64.getDecoder().decode(usuarioDTO.getImagemBase64());
                        usuarioExistente.setImagemPerfil(imagemBytes);
                    }
                }

                boolean sucesso = usuarioService.atualizarUsuario(usuarioExistente);
                if (sucesso) {
                    return gson.toJson(usuarioExistente);
                } else {
                    res.status(500);
                    return "{\"erro\":\"Erro ao atualizar usuário.\"}";
                }
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        delete("/usuario/:id", (req, res) -> {
            res.type("application/json");
            int id = Integer.parseInt(req.params(":id"));
            boolean sucesso = usuarioService.excluirUsuario(id);
            if (sucesso) {
                return "{\"mensagem\":\"Usuário removido com sucesso.\"}";
            } else {
                res.status(404);
                return "{\"erro\":\"Usuário não encontrado.\"}";
            }
        });

        // ROTA: Solicitar recuperação de senha
post("/usuario/recuperar-senha", (req, res) -> {
    res.type("application/json");
    try {
        JsonObject body = JsonParser.parseString(req.body()).getAsJsonObject();
        String email = body.get("email").getAsString();

        Usuario usuario = usuarioService.buscarUsuarioPorEmail(email);
        if (usuario == null) {
            res.status(404);
            return "{\"erro\":\"Usuário não encontrado.\"}";
        }

        // Gere um token de recuperação (exemplo simples, use algo mais seguro em produção)
        String token = java.util.UUID.randomUUID().toString();
        usuarioService.salvarTokenRecuperacao(usuario.getId(), token);

        // Envie o token por e-mail
        String link = "http://localhost:3000/redefinir-senha?token=" + token;
String corpo = "<div style='text-align:center; font-family:sans-serif;'>"
    + "<img src='https://i.imgur.com/6WTOj8D.png' alt='FitFlex' style='width:120px; margin-bottom:24px;'/>"
    + "<h2 style='color:#222;'>Recuperação de senha FitFlex</h2>"
    + "<p style='font-size:1.1rem;'>Clique no botão abaixo para redefinir sua senha:</p>"
    + "<a href='" + link + "' style='display:inline-block;padding:12px 28px;background:#86C019;color:#fff;text-decoration:none;border-radius:5px;font-size:1.1rem;margin:20px 0;'>Redefinir senha</a>"
    + "<p style='color:#555;'>Ou copie e cole este link no navegador:<br><span style='word-break:break-all;'>" + link + "</span></p>"
    + "</div>";
        try {
            EmailUtil.enviarEmail(usuario.getEmail(), "Recuperação de senha", corpo);
        } catch (Exception e) {
            System.out.println("Erro ao enviar e-mail: " + e.getMessage());
        }

        return "{\"mensagem\":\"Se o e-mail existir, um link de recuperação foi enviado.\"}";
    } catch (Exception e) {
        res.status(400);
        return "{\"erro\":\"" + e.getMessage() + "\"}";
    }
});

// ROTA: Redefinir senha usando o token
post("/usuario/redefinir-senha", (req, res) -> {
    res.type("application/json");
    try {
        JsonObject body = JsonParser.parseString(req.body()).getAsJsonObject();
        String token = body.get("token").getAsString();
        String novaSenha = body.get("novaSenha").getAsString();

        Usuario usuario = usuarioService.buscarUsuarioPorToken(token);
        if (usuario == null) {
            res.status(400);
            return "{\"erro\":\"Token inválido ou expirado.\"}";
        }

        usuario.setSenha(novaSenha);
        usuarioService.atualizarSenha(usuario);
        usuarioService.removerTokenRecuperacao(usuario.getId());

        return "{\"mensagem\":\"Senha redefinida com sucesso.\"}";
    } catch (Exception e) {
        res.status(400);
        return "{\"erro\":\"" + e.getMessage() + "\"}";
    }
});

        post("/receita", (req, res) -> {
            res.type("application/json");

            try {
                ReceitaDTO receitaDTO = gson.fromJson(req.body(), ReceitaDTO.class);
                Receita receita = new Receita();
                receita.setNome(receitaDTO.getNome());
                receita.setModoPreparo(receitaDTO.getModoPreparo());

                if (receitaDTO.getImagemBase64() != null && !receitaDTO.getImagemBase64().isEmpty()) {
                    byte[] imagemBytes = Base64.getDecoder().decode(receitaDTO.getImagemBase64());
                    receita.setImagemReceita(imagemBytes);
                }

                boolean sucesso = receitaService.cadastrarReceita(receita);
                if (sucesso) {
                    res.status(201);
                    // Retornar a receita com ID para o frontend
                    ReceitaDTO responseDTO = new ReceitaDTO();
                    responseDTO.setId(receita.getId());
                    responseDTO.setNome(receita.getNome());
                    responseDTO.setModoPreparo(receita.getModoPreparo());
                    if (receita.getImagemReceita() != null) {
                        responseDTO.setImagemBase64(Base64.getEncoder().encodeToString(receita.getImagemReceita()));
                    }
                    return gson.toJson(responseDTO);
                } else {
                    res.status(500);
                    return "{\"erro\":\"Erro ao adicionar receita.\"}";
                }
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        get("/receita", (req, res) -> {
            res.type("application/json");
            List<Receita> receitas = receitaService.listarTodasReceitas();

            List<ReceitaDTO> dtos = receitas.stream().map(r -> {
                ReceitaDTO dto = new ReceitaDTO();
                dto.setId(r.getId());
                dto.setNome(r.getNome());
                dto.setModoPreparo(r.getModoPreparo());
                if (r.getImagemReceita() != null) {
                    dto.setImagemBase64(Base64.getEncoder().encodeToString(r.getImagemReceita()));
                }
                return dto;
            }).collect(Collectors.toList());

            return gson.toJson(dtos);
        });

        get("/receita/:id", (req, res) -> {
            res.type("application/json");
            int id = Integer.parseInt(req.params(":id"));
            Receita receita = receitaService.buscarReceitaPorId(id);

            if (receita != null) {
                ReceitaDTO dto = new ReceitaDTO();
                dto.setId(receita.getId());
                dto.setNome(receita.getNome());
                dto.setModoPreparo(receita.getModoPreparo());
                if (receita.getImagemReceita() != null) {
                    dto.setImagemBase64(Base64.getEncoder().encodeToString(receita.getImagemReceita()));
                }
                return gson.toJson(dto);
            } else {
                res.status(404);
                return "{\"erro\":\"Receita não encontrada.\"}";
            }
        });

        put("/receita/:id", (req, res) -> {
            res.type("application/json");
            int id = Integer.parseInt(req.params(":id"));

            try {
                ReceitaDTO receitaDTO = gson.fromJson(req.body(), ReceitaDTO.class);
                Receita receita = receitaService.buscarReceitaPorId(id);

                if (receita == null) {
                    res.status(404);
                    return "{\"erro\":\"Receita não encontrada.\"}";
                }

                receita.setNome(receitaDTO.getNome());
                receita.setModoPreparo(receitaDTO.getModoPreparo());

                if (receitaDTO.getImagemBase64() != null) {
                    if (receitaDTO.getImagemBase64().isEmpty()) {
                        receita.setImagemReceita(null);
                    } else {
                        byte[] imagemBytes = Base64.getDecoder().decode(receitaDTO.getImagemBase64());
                        receita.setImagemReceita(imagemBytes);
                    }
                }

                boolean sucesso = receitaService.atualizarReceita(receita);
                if (sucesso) {
                    // Retornar o objeto completo como resposta, igual ao GET
                    ReceitaDTO responseDTO = new ReceitaDTO();
                    responseDTO.setId(receita.getId());
                    responseDTO.setNome(receita.getNome());
                    responseDTO.setModoPreparo(receita.getModoPreparo());
                    if (receita.getImagemReceita() != null) {
                        responseDTO.setImagemBase64(Base64.getEncoder().encodeToString(receita.getImagemReceita()));
                    }
                    return gson.toJson(responseDTO);
                } else {
                    res.status(500);
                    return "{\"erro\":\"Erro ao atualizar receita.\"}";
                }
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        delete("/receita/:id", (req, res) -> {
            res.type("application/json");
            int id = Integer.parseInt(req.params(":id"));
            // Remova todas as referências antes de deletar a receita
            favoritarService.removerTodosPorReceita(id);
            avaliarService.removerTodosPorReceita(id);
            receitaIngredienteService.removerTodosPorReceita(id);
            boolean sucesso = receitaService.excluirReceita(id);
            if (sucesso) {
                return "{\"mensagem\":\"Receita removida com sucesso.\"}";
            } else {
                res.status(404);
                return "{\"erro\":\"Receita não encontrada.\"}";
            }
        });

        post("/receitaIngrediente", (req, res) -> {
            res.type("application/json");
            ReceitaIngrediente receitaIngrediente = gson.fromJson(req.body(), ReceitaIngrediente.class);
            try {
                boolean sucesso = receitaIngredienteService.adicionarIngredienteReceita(receitaIngrediente);
                if (sucesso) {
                    res.status(201);
                    return gson.toJson(receitaIngrediente);
                } else {
                    res.status(500);
                    return "{\"erro\":\"Erro ao adicionar associação ingrediente-receita.\"}";
                }
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        // Listar todas associações ReceitaIngrediente
        get("/receitaIngrediente", (req, res) -> {
            res.type("application/json");
            List<ReceitaIngrediente> lista = receitaIngredienteService.listarTodas();
            return gson.toJson(lista);
        });

        // Atualizar quantidade de ingrediente em receita
        put("/receitaIngrediente", (req, res) -> {
            res.type("application/json");
            ReceitaIngrediente receitaIngrediente = gson.fromJson(req.body(), ReceitaIngrediente.class);
            try {
                boolean sucesso = receitaIngredienteService.atualizarQuantidade(receitaIngrediente);
                if (sucesso) {
                    return gson.toJson(receitaIngrediente);
                } else {
                    res.status(500);
                    return "{\"erro\":\"Erro ao atualizar associação.\"}";
                }
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        // Deletar associação ingrediente-receita (chave composta)
        delete("/receitaIngrediente/:ingredienteId/:receitaId", (req, res) -> {
            res.type("application/json");
            int ingredienteId = Integer.parseInt(req.params(":ingredienteId"));
            int receitaId = Integer.parseInt(req.params(":receitaId"));
            try {
                boolean sucesso = receitaIngredienteService.removerIngredienteReceita(ingredienteId, receitaId);
                if (sucesso) {
                    return "{\"mensagem\":\"Associação removida com sucesso.\"}";
                } else {
                    res.status(404);
                    return "{\"erro\":\"Associação não encontrada.\"}";
                }
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        // Listar ingredientes de uma receita específica
        get("/receitaIngrediente/receita/:receitaId", (req, res) -> {
            res.type("application/json");
            int receitaId = Integer.parseInt(req.params(":receitaId"));
            try {
                List<ReceitaIngrediente> lista = receitaIngredienteService.listarPorReceita(receitaId);
                return gson.toJson(lista);
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        post("/favorita", (req, res) -> {
            res.type("application/json");
            Favoritar favoritar = gson.fromJson(req.body(), Favoritar.class);
            try {
                boolean sucesso = favoritarService.adicionarReceitaUsuario(favoritar);
                if (sucesso) {
                    res.status(201);
                    return gson.toJson(favoritar);
                } else {
                    res.status(500);
                    return "{\"erro\":\"Erro ao adicionar associação receita-usuario.\"}";
                }
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        // Listar todas associações Favoritar
        get("/favorita", (req, res) -> {
            res.type("application/json");
            List<Favoritar> lista = favoritarService.listarTodas();
            return gson.toJson(lista);
        });

        // Deletar associação receitas-usuario (chave composta)
        delete("/favorita/:receitaId/:usuarioId", (req, res) -> {
            res.type("application/json");
            int usuarioId = Integer.parseInt(req.params(":usuarioId"));
            int receitaId = Integer.parseInt(req.params(":receitaId"));
            try {
                boolean sucesso = favoritarService.removerReceitaUser(receitaId, usuarioId);
                if (sucesso) {
                    return "{\"mensagem\":\"Associação removida com sucesso.\"}";
                } else {
                    res.status(404);
                    return "{\"erro\":\"Associação não encontrada.\"}";
                }
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        // Listar receitas de um usuario específico
        get("/favorita/receita/:usuarioId", (req, res) -> {
            res.type("application/json");
            int usuarioId = Integer.parseInt(req.params(":usuarioId"));
            try {
                List<Favoritar> lista = favoritarService.listarPorUsuario(usuarioId);
                return gson.toJson(lista);
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        post("/avaliar", (req, res) -> {
            res.type("application/json");
            Avaliar avaliar = gson.fromJson(req.body(), Avaliar.class);
            try {
                boolean sucesso = avaliarService.adicionarReceitaUsuario(avaliar);
                if (sucesso) {
                    res.status(201);
                    return gson.toJson(avaliar);
                } else {
                    res.status(500);
                    return "{\"erro\":\"Erro ao adicionar associação receita-usuario.\"}";
                }
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        // Listar todas associações Favoritar
        get("/avaliar", (req, res) -> {
            res.type("application/json");
            List<Avaliar> lista = avaliarService.listarTodas();
            return gson.toJson(lista);
        });

        // Deletar associação receitas-usuario (chave composta)
        delete("/avaliar/:receitaId/:usuarioId", (req, res) -> {
            res.type("application/json");
            int usuarioId = Integer.parseInt(req.params(":usuarioId"));
            int receitaId = Integer.parseInt(req.params(":receitaId"));
            try {
                boolean sucesso = avaliarService.removerReceitaUser(receitaId, usuarioId);
                if (sucesso) {
                    return "{\"mensagem\":\"Associação removida com sucesso.\"}";
                } else {
                    res.status(404);
                    return "{\"erro\":\"Associação não encontrada.\"}";
                }
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        // Listar receitas de um usuario específico
        get("/avaliar/receita/:usuarioId", (req, res) -> {
            res.type("application/json");
            int usuarioId = Integer.parseInt(req.params(":usuarioId"));
            try {
                List<Avaliar> lista = avaliarService.listarPorUsuario(usuarioId);
                return gson.toJson(lista);
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        get("/avaliar/count/:receitaId", (req, res) -> {
            res.type("application/json");
            int receitaId = Integer.parseInt(req.params(":receitaId"));
            try {
                int quantidade = avaliarService.contarAvaliacoesPorReceita(receitaId);
                return "{\"quantidadeAvaliacoes\": " + quantidade + "}";
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });

        get("/avaliar/receitas-com-likes", (req, res) -> {
            res.type("application/json");
            try {
                // Busca todas as receitas
                List<Receita> todasReceitas = receitaService.listarTodasReceitas(); // ou receitaDAO.listarTodos()
                List<Receita> receitasComLikes = new ArrayList<>();

                for (Receita receita : todasReceitas) {
                    int quantidadeLikes = avaliarService.contarAvaliacoesPorReceita(receita.getId());
                    if (quantidadeLikes > 0) {
                        receitasComLikes.add(receita);
                    }
                }

                return gson.toJson(receitasComLikes);
            } catch (Exception e) {
                res.status(400);
                return "{\"erro\":\"" + e.getMessage() + "\"}";
            }
        });
    }

    public static void enableCORS(final String origin, final String methods, final String headers) {
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> {

            response.header("Access-Control-Allow-Origin", origin);
            response.header("Access-Control-Request-Method", methods);
            response.header("Access-Control-Allow-Headers", headers);
        });
    }
}