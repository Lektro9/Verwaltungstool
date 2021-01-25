import { Request, Response } from "express";
import {getConnection} from "typeorm";
import {PersonEntity} from "../../entity/person.entity";

export const readAllPersons = (req: Request, res: Response) => {
    return getConnection().getRepository(PersonEntity).find();
}