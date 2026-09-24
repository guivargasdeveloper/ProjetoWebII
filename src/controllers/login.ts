// Importar a biblioteca Express
import express, {Request, Response} from "express";

// Importar o arquivo com as credenciais do banco de dados
import {AppDataSource} from "../data-source";

// Criar a aplicação Express
const router = express.Router();

// Iniciar a conexão com o BD
AppDataSource.initialize().then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
}).catch((error)=>{
    console.log("Erro ao conectar com o banco de dados:", error);
})

// Criar a rota GET principal
router.get("/", (req: Request, res: Response) => {
    res.send("Bem-vindo Pessoal! tela de login da rota");
});

// Exportar a intrução da rota

export default router;
