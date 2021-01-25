import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {

    constructor(data?: User) {
        if (data) {
            this.login = data.login;
            this.password = data.password;
            this.role = data.role;
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    login: string;

    //TODO: create hashed passwords here, this is just for testing
    @Column()
    password: string;

    // 0 == user, 1 == admin
    @Column()
    role: number;

}
