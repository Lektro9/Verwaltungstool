import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PersonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  classification: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;
}

