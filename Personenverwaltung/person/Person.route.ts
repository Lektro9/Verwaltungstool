
import express, { Request, Response } from "express";

import {readAllPersons} from "./read/read.db"

class PersonRouter {

    private path: string = "/api/v1/personenverwaltung/persons";

    constructor(server: express.Express) {
        const router = express.Router();
    
        router.get(this.path, async (req: Request, res: Response) => {
            try {
                let persons = await readAllPersons(req, res);
                //res.json(persons.rows);
              } catch (err) {
                console.error(err);
                res.sendStatus(500);
              }
        });
        server.use('/', router)
      }
}

export default PersonRouter;