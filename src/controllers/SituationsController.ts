// Importar a biblioteca Express
import express, { Request, Response } from "express";

// Importar o arquivo com as credenciais do banco de dados
import { AppDataSource } from "../data-source";

// Importar a validação e o operador Not do TypeORM
import * as yup from "yup";
import { Not } from "typeorm";

// Importar a ENTIDADE (ajuste o caminho conforme o seu projeto)
import  Situation  from "../controllers/SituationsController";

// Importar as Controllers
import AuthController from "../controllers/AuthController";

// Criar a aplicação Express
const router = express.Router();

// Iniciar a conexão com o BD
AppDataSource.initialize()
    .then(() => {
        console.log("Conexão com o banco de dados estabelecida com sucesso!");
    })
    .catch((error) => {
        console.log("Erro ao conectar com o banco de dados:", error);
    });

// Criar as rotas
router.use("/auth", AuthController);

// Schema de validação (usado no cadastro e na edição)
const situationSchema = yup.object().shape({
    namesituation: yup
        .string()
        .required("O campo 'namesituation' é obrigatório!")
        .min(3, "O campo 'namesituation' deve ter no mínimo 3 caracteres!"),
});

// LISTAR situações (com paginação)
router.get("/situations", async (req: Request, res: Response) => {
    try {
        // Obter o repositório da entidade Situation
        const situationRepository = AppDataSource.getRepository(Situation);

        // Receber a página atual
        const page = Number(req.query.page) || 1;

        // Definir o limite de itens por página
        const limite = 10;

        // Contar o total de itens na tabela
        const totalSituations = await situationRepository.count();

        // Verificar se existem registros
        if (totalSituations === 0) {
            res.status(400).json({ messagem: "Nenhuma situação encontrada!" });
            return;
        }

        // Calcular a última página
        const lastPage = Math.ceil(totalSituations / limite);

        // Calcular o offset (a partir de qual item começar a buscar)
        const offset = (page - 1) * limite;

        // Verificar se a página solicitada é válida
        if (page < 1 || page > lastPage) {
            res.status(400).json({
                messagem: `Página não encontrada! O total de páginas é ${lastPage}.`,
            });
            return;
        }

        // Recuperar os itens da tabela com paginação
        const situations = await situationRepository.find({
            skip: offset,
            take: limite,
            order: { id: "DESC" },
        });

        // Retornar os itens encontrados como resposta
        res.status(200).json({
            currentPage: page,
            lastPage,
            totalSituations,
            situations,
        });
        return;
    } catch (error) {
        res.status(500).json({
            messagem: "Erro ao listar situações!",
        });
        return;
    }
});

// EDITAR item cadastrado em situação
router.put("/situations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const data = req.body;

        // Validar os dados recebidos
        await situationSchema.validate(data, { abortEarly: false });

        const situationRepository = AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({
            id: parseInt(id as string),
        });

        if (!situation) {
            res.status(404).json({ messagem: "Situação não encontrada!" });
            return;
        }

        // Verificar se já existe OUTRA situação com o mesmo nome
        const existingSituation = await situationRepository.findOne({
            where: {
                nameSituations: data.namesituation,
                id: Not(situation.id),
            },
        });

        if (existingSituation) {
            res.status(400).json({ messagem: "Situação já existente!" });
            return;
        }

        // Atualizar os dados
        situationRepository.merge(situation, {
            nameSituations: data.namesituation,
        });

        // Salvar as alterações
        const updatedSituation = await situationRepository.save(situation);

        res.status(200).json({
            messagem: "Situação atualizada com sucesso!",
            situation: updatedSituation,
        });
        return;
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                messagem: "Erro de validação!",
                errors: error.errors,
            });
            return;
        }

        res.status(500).json({
            messagem: "Erro ao editar situação!",
        });
        return;
    }
});

// CADASTRAR item no banco de dados (POST)
router.post("/situations", async (req: Request, res: Response) => {
    try {
        const data = req.body;

        // Validar os dados recebidos
        await situationSchema.validate(data, { abortEarly: false });

        const situationRepository = AppDataSource.getRepository(Situation);

        // Verificar se já existe uma situação com o mesmo nome
        const existingSituation = await situationRepository.findOne({
            where: { nameSituations: data.namesituation },
        });

        if (existingSituation) {
            res.status(400).json({
                messagem: "Situação já existente!",
            });
            return;
        }

        const newSituation = situationRepository.create({
            nameSituations: data.namesituation,
        });

        await situationRepository.save(newSituation);

        res.status(201).json({
            messagem: "Situação criada com sucesso!",
            situation: newSituation,
        });
        return;
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                messagem: "Erro de validação!",
                errors: error.errors,
            });
            return;
        }

        res.status(500).json({
            messagem: "Erro ao criar situação!",
        });
        return;
    }
});

// REMOVER item do banco de dados
router.delete("/situations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const situationRepository = AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({
            id: parseInt(id as string),
        });

        if (!situation) {
            res.status(404).json({ messagem: "Situação não encontrada!" });
            return;
        }

        // Remover o registro (não chamar save() depois, senão ele é recriado)
        await situationRepository.remove(situation);

        res.status(200).json({
            messagem: "Situação removida com sucesso!",
        });
        return;
    } catch (error) {
        res.status(500).json({
            messagem: "Erro ao remover situação!",
        });
        return;
    }
});

// Exportar as rotas
export default router;
