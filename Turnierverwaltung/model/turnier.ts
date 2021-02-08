import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Spiel } from "./spiel";
import { TurnierTeilnehmer } from "./turnierTeilnehmer";

@Entity()
export class Turnier {

    constructor(data?: Turnier) {
        if (data) {
            this.name = data.name;
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => TurnierTeilnehmer, turnierTeilnehmer => turnierTeilnehmer.turnier)
    teilnehmer: TurnierTeilnehmer[];

    @OneToMany(() => Spiel, spiel => spiel.turnier)
    games: Spiel[];

}
