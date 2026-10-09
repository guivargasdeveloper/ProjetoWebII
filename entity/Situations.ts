import { Entity, PrimaryGeneratedColumn, OneToMany, Column} from "typeorm"
import { User } from "./Users";

@Entity("situations")
export class Situations {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nameSituations!: string;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;

    @OneToMany(() => User, (user) => user.situations)
    users!: User[];
}
