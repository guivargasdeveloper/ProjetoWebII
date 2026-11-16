// Importar a biblioteca Express
import express from "express";

// Importar variáveis de ambiente
import dotenv from "dotenv";

// Importar a biblioteca para permitir conexão externa
import cors from 'cors';

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

// Criar a aplicação Express
const app = express();

// Incluir as controllers
import TestConnectionController from "./controllers/TestConnectionController";
import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";

// Criar as rotas
app.use("/", TestConnectionController);
app.use("/", AuthController);
app.use("/situations", SituationsController);



// Iniciar o servidor na porta 8000
app.listen(process.env.PORT, () => {
    console.log(`Servidor Iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`)
});
