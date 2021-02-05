import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Person } from "./person.entity";

@Entity()
export class Trainer {
  constructor(data?: Trainer) {
    if (data) {
      this.experience = data.experience;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  experience: number;

  @OneToOne(() => Person, person => person.trainer, {onDelete: 'CASCADE' })
  @JoinColumn()
  person: Person;
}
