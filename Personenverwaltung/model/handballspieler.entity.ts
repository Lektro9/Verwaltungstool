import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Person } from "./person.entity";

@Entity()
export class Handballspieler {
  constructor(data?: Handballspieler) {
    if (data) {
      this.fieldPosition = data.fieldPosition;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fieldPosition: string;

  @OneToOne(() => Person, person => person.handballspieler, {onDelete: 'CASCADE' })
  @JoinColumn()
  person: Person;
}
