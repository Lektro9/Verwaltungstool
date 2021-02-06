import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MannschaftMitglied } from './mannschaftMitglieder';
@Entity()
export class Mannschaft {
  constructor(data?: Mannschaft) {
    if (data) {
      this.name = data.name;
      this.sportType = data.sportType;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sportType: string;

  @Column({ default: 0 })
  gamesWon: number;

  @Column({ default: 0 })
  gamesLost: number;

  @Column({ default: 0 })
  draws: number;

  @OneToMany(
    () => MannschaftMitglied,
    (mannschaftMitglied) => mannschaftMitglied.mannschaft
  )
  mitglieder: MannschaftMitglied[];

  //TODO: how many goals, how many "enemygoals"
}
