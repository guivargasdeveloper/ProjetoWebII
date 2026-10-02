import { Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity("situations")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nameSituations!: string;

    @Column()
    createdAt!: Date;

    @Column()
    updatedAt!: Date;
}