import { Entity, Column } from "typeorm";
import { Person } from "./person.entity";

@Entity()
export class Fussballspieler extends Person {
  constructor(data?: Fussballspieler) {
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
