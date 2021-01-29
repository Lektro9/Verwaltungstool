import { Entity, Column } from "typeorm";
import { Person } from "./person.entity";

@Entity()
export class Tennisspieler extends Person {
  constructor(data?: Tennisspieler) {
    super();
    if (data) {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.birthday = data.birthday;
      this.handedness = data.handedness;
    }
  }

  @Column()
  handedness: string;
}
