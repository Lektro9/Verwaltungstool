import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Person {

    constructor(data?: Person) {
        if (data) {
            this.firstName = data.firstName;
            this.lastName = data.lastName;
            this.birthday = data.birthday;
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    birthday: number;
}
