import { Entity, Column } from "typeorm";
import { Person } from "./person.entity";

@Entity()
export class Physiotherapeut extends Person {
  constructor(data?: Physiotherapeut) {
    super();
    if (data) {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.birthday = data.birthday;
      this.treatmentType = data.treatmentType;
    }
  }
  @Column()
  treatmentType: string;
}
