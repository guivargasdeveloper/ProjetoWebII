import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column} from "typeorm"
import { Situations } from "./Situations";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({unique: true})
    email!: string;

    @ManyToOne(() => Situations, (situation) => situation.users)
    @JoinColumn({ name: "situation_id" })
    situations!: Situations;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;
}
