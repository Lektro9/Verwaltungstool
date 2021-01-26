import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Turnier } from "./turnier";

@Entity()
export class TurnierTeilnehmer {

    constructor(data?: TurnierTeilnehmer) {
        if (data) {
            this.mannschaftID = data.mannschaftID;
            this.turnier = data.turnier;
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mannschaftID: number;

    @ManyToOne(() => Turnier, turnier => turnier.teilnehmer, { onDelete: 'CASCADE' })
    turnier: Turnier;

    //TODO: vielleicht noch turnierstatus und sportArt?
}
