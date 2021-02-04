import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Person } from "./person.entity";

@Entity()
export class Tennisspieler {
  constructor(data?: Tennisspieler) {
    if (data) {
      this.handedness = data.handedness;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  handedness: string;

  @OneToOne(() => Person, person => person.tennisspieler, {onDelete: 'CASCADE' })
  @JoinColumn()
  person: Person;
}
