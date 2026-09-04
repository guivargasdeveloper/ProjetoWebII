// Importar a biblioteca Express
import express from "express";

// Criar a aplicação Express
const app = express();

// Incluir as controllers
import login from "./controllers/login";

// Criar as rotas
app.use("/", login);

// Iniciar o servidor na porta 8000
app.listen(8000, () => {
    console.log("Servidor Iniciado na porta 8000: http://localhost:8000")
});
