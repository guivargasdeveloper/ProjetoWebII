// Importar a biblioteca Express
import express, {Request, Response} from "express";

// Importar o arquivo com as credenciais do banco de dados
import {AppDataSource} from "../data-source";

import Situation from "../controllers/SituationsController";

// Criar a aplicação Express
const router = express.Router();

// Iniciar a conexão com o BD
AppDataSource.initialize().then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
}).catch((error)=>{
    console.log("Erro ao conectar com o banco de dados:", error);
})

// Incluir as Controllers
import AuthController from "../controllers/AuthController";

// Criar as rotas
router.use("/auth", AuthController);

// Criar a LISTA
router.get("/situations", (req: Request, res: Response) => {
    try {

        const situationRepository = AppDataSource.getRepository(Situation);

        const situations = situationRepository.find();
        
        res.status(200).json({ situations });
        return


    } catch (error) {
        res.status(500).json({
            messagem: "Erro ao listar situações!",
        });
        return
    }
});

// Criar a visualização do item cadastrado em situação
router.put("/situations/:id", async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const data = req.body;

        const situationRepository = AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({id : parseInt(id as string)});

        if(!situation) {
            res.status(404).json({ messagem: "Situação não encontrada!" });
            return;
        }
        // Atualiza os dados
        situationRepository.merge(situation, data);

        // Salvar as alterações
        const updatedSituation = await situationRepository.save(situation);

        res.status(200).json({ 
            messagem: "Situação atualizada com sucesso!",
            situation: updatedSituation
        });
        


    } catch (error) {
        res.status(500).json({
            messagem: "Erro ao editar situações!",
        });
        return
    }
});


// Cadastra item do banco de dados POST
router.post("/situations", async(req:Request, res:Response) =>{
    try {

        var data = req.body;

        const situationRepository = AppDataSource.getRepository(Situation);

        const newSituation = situationRepository.create(data);

        await situationRepository.save(newSituation);

        res.status(201).json({
            messagem: "Situação criada com sucesso!",
            situation: newSituation,
        });
    } catch (error) {
        res.status(500).json({
            messagem: "Erro ao criar situação!",
            });
    }
});

router.delete("/situations/:id", async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const situationRepository = AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({id : parseInt(id as string)});

        if(!situation) {
            res.status(404).json({ messagem: "Situação não encontrada!" });
            return;
        }
        // Remove os dados
        await situationRepository.remove(situation);

        // Salvar as alterações
        const updatedSituation = await situationRepository.save(situation);

        res.status(200).json({ 
            messagem: "Situação removida com sucesso!",
            situation: updatedSituation
        });

    } catch (error) {
        res.status(500).json({
            messagem: "Erro ao remover situações!",
        });
        return
    }
    

});


// Exportar a intrução da rota

export default router

