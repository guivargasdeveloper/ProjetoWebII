// Importar a biblioteca Express
import express, {Request, Response} from "express";

// Criar a aplicação Express
const app = express();

// Criar a rota GET principal
app.get("/", (req: Request, res: Response) => {
    res.send("Bem-vindo Pessoal!");
});

// Iniciar o servidor na porta 8000
app.listen(8000, () => {
    console.log("Servidor Iniciado na porta 8000: http://localhost:8000")
});
