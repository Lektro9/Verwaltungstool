import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Fussballspieler} from "./fussballspieler.entity"
import { Handballspieler} from "./handballspieler.entity"
import { Tennisspieler} from "./tennisspieler.entity"
import { Trainer} from "./trainer.entity"
import { Physiotherapeut} from "./physiotherapeut.entity"
@Entity()
export class Person {
  constructor(data?: Person) {
    if (data) {
      this.type= data.type;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.birthday = data.birthday;

    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthday: number;

  @OneToOne(() => Fussballspieler, fussballspieler => fussballspieler.person, {eager: true})
  fussballspieler: Fussballspieler;

  @OneToOne(() => Handballspieler, handballspieler => handballspieler.person, {eager: true})
  handballspieler: Handballspieler;

  @OneToOne(() => Tennisspieler, tennisspieler => tennisspieler.person, {eager: true})
  tennisspieler: Tennisspieler;

  @OneToOne(() => Trainer, trainer => trainer.person, {eager: true})
  trainer: Trainer;

  @OneToOne(() => Physiotherapeut, physiotherapeut => physiotherapeut.person, {eager: true})
  physiotherapeut: Physiotherapeut;
}
