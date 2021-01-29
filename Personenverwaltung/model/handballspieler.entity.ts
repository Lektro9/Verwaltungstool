import { Entity, Column } from "typeorm";
import { Person } from "./person.entity";

@Entity()
export class Handballspieler extends Person {
  constructor(data?: Handballspieler) {
    super();
    if (data) {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.birthday = data.birthday;
      this.fieldPosition = data.fieldPosition;
    }
  }
  @Column()
  fieldPosition: string;
}
