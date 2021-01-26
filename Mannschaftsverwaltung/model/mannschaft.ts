import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Mannschaft {

    constructor(data?: Mannschaft) {
        if (data) {
            this.name = data.name;
            this.sportType = data.sportType;
            this.gamesWon = data.gamesWon;
            this.gamesLost = data.gamesLost;
            this.draws = data.draws;
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    sportType: string;

    @Column()
    gamesWon: number;

    @Column()
    gamesLost: number;

    @Column()
    draws: number;

    //TODO: how many goals, how many "enemygoals"
}
