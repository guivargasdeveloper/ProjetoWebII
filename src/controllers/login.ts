// Importar a biblioteca Express
import express, {Request, Response} from "express";

// Criar a aplicação Express
const router = express.Router();

// Criar a rota GET principal
router.get("/", (req: Request, res: Response) => {
    res.send("Bem-vindo Pessoal! tela de login da rota");
});

// Exportar a intrução da rota

export default router;