import { Entity, Column } from "typeorm";
import { Person } from "./person.entity";

@Entity()
export class Trainer extends Person {
  constructor(data?: Trainer) {
    super();
    if (data) {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.birthday = data.birthday;
      this.experience = data.experience;
    }
  }
  @Column()
  experience: number;
}
