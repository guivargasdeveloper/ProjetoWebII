import { AppDataSource } from "./data-source"
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";

const runSeeds = async () => {
    console.log("Conectando banco de dados...");

    await AppDataSource.initialize();

    console.log("Banco de dados conectado!");

    try {
        // Criar a instancia da classe seeds
        const situationsSeeds = new CreateSituationsSeeds();

        // Executa as seeds
        await situationsSeeds.run(AppDataSource);

    } catch (error) {
        console.error("Erro ao executar as seeds:", error);
    
    }finally {

        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada!");
    }
};

runSeeds();