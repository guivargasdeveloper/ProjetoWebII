import { DataSource } from "typeorm";
import { Situations } from "../entity/Situations";

export default class CreateSituationsSeeds {

    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando a criação das seeds de situações...");

        const situationsRepository = dataSource.getRepository(Situations);

        const existingCount = await situationsRepository.count();

        if (existingCount > 0) {
            console.log("As seeds de situações já foram criadas anteriormente. Nenhuma ação será realizada.");
            return;
        }
        const situationsData = [
            { nameSituations: "Ativo" },
            { nameSituations: "Inativo" },
            { nameSituations: "Pendente" },
           
        ];

        await situationsRepository.save(situationsData);

        console.log("Seeds de situações criadas com sucesso!");

    }

}