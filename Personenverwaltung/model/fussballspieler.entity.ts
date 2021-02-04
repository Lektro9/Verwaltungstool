import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Person } from "./person.entity";

@Entity()
export class Fussballspieler {
  constructor(data?: Fussballspieler) {
    if (data) {
      this.fieldPosition = data.fieldPosition;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fieldPosition: string;

  @OneToOne(() => Person, (person) => person.fussballspieler, {onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  person: Person;
}
