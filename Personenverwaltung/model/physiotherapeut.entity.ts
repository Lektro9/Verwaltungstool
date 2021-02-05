import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Person } from "./person.entity";

@Entity()
export class Physiotherapeut {
  constructor(data?: Physiotherapeut) {
    if (data) {
      this.treatmentType = data.treatmentType;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  treatmentType: string;

  @OneToOne(() => Person, person => person.physiotherapeut, {onDelete: 'CASCADE' })
  @JoinColumn()
  person: Person;
}
