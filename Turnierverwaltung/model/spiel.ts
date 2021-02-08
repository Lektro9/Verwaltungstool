import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Turnier } from "./turnier";
import { TurnierTeilnehmer } from "./turnierTeilnehmer";

@Entity()
export class Spiel {

    constructor(data?: Spiel) {
        if (data) {
            this.team1Id = data.team1Id;
            this.team2Id = data.team2Id;
            this.team1Punkte = data.team1Punkte;
            this.team2Punkte = data.team2Punkte;
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    team1Id: number;

    @Column()
    team2Id: number;

    @Column()
    team1Punkte: number;

    @Column()
    team2Punkte: number;

    @ManyToOne(() => Turnier, turnier => turnier.games, { onDelete: 'CASCADE' })
    turnier: Turnier;

    //TODO: vielleicht noch turnierstatus und die sportArt?
}
