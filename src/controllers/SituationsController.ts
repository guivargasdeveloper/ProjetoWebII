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
router.get("/situations", async (req: Request, res: Response) => {
    try {

        // Obter o repositório da entidade Situation
        const situationRepository = AppDataSource.getRepository(Situation);

        // Receber o numero de itens por página e a página atual
        const page = Number(req.query.page) || 1;

        // Definir o limite de itens por página e a página atual
        const limite = 1;

        // Contar o total de itens na tabela
        const totalSituations = await situationRepository.count();

        // Verificar se existem registros por pagina
        if (totalSituations === 0) {
            res.status(400).json({ messagem: "Nenhuma situação encontrada!" });
            return;
        }

        // Calcular a ultima pagina
        const lastPage = Math.ceil(totalSituations / limite);

        // Calcular o offset para a consulta (a partir de qual item começar a buscar)
        const offset = (page - 1) * limite;

        // Verificar se a página solicitada é válida
        if (page > lastPage) {
            res.status(400).json({ messagem: "Página não encontrada! O total de páginas é ${lastPage}." });
            return;
        }


        // Recuperar os itens da tabela com paginação
        const situations = situationRepository.find(
{
            skip: offset,
            take: limite,
            order: {id: "DESC"},
        });
        
        // Retornar os itens encontrados como resposta
        res.status(200).json({ 
            currentPage: page,
            lastPage,
            totalSituations,
            situations,
        });
        return


    } catch (error) {
        res.status(500).json({
            messagem: "Erro ao listar situações!",
        });
        return;
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

