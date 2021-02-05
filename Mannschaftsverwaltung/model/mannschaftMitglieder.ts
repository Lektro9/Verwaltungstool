import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Mannschaft } from "./mannschaft";

@Entity()
export class MannschaftMitglied {

    constructor(data?: MannschaftMitglied) {
        if (data) {
            this.personenId = data.personenId;
            this.mannschaft = data.mannschaft;
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    personenId: number;

    @ManyToOne(() => Mannschaft, mannschaft => mannschaft.mitglieder, { onDelete: 'CASCADE' })
    mannschaft: Mannschaft;

    //TODO: how many goals, how many "enemygoals"
}
