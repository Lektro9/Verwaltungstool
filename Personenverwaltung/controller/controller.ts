import express, { Application, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'reflect-metadata';
import { createConnection, Repository, Connection } from 'typeorm';
import cors from 'cors';
import dotenv from 'dotenv';
import { Person } from '../model/person';

dotenv.config();

export class Controller {
    app: Application
    personRepository: Repository<Person>
    connection: Connection
    port: number

    constructor() {
        createConnection().then((connection) => {
            this.connection = connection;
            this.personRepository = this.connection.getRepository(Person);
        });
        this.app = express();
        this.port = 3004;
    }

    /**
     * useMiddleware
     * Funktionen die vor jeder Route ausgeführt werden soll
     */
    public useMiddleware(): void {
        //zum Loggen sämtlicher Zugriffe
        const infoLogger = (req: Request, res: Response, next: NextFunction) => {
            console.log(`A ${req.method}-request was made by ${req.ip}`);
            next();
        };
        this.app.use(infoLogger);
        //erlaubt Webserver jsons zu empfangen
        this.app.use(express.json());
        //setzt CORS Header 'Access-Control-Allow-Origin' und welche REST-Methoden von wem genutzt werden dürfen
        //hier: alle dürfen alles
        this.app.use(cors());
    }

    /**
     * createRoutes
     * 
     * Definiert Routen, Methoden und deren zugehörige Funktionen
     * 
     * bind() wird benötigt wenn Eigenschaften aus dieser Klasse verwendet werden
     * müssen
     */
    public createRoutes(): void {
        // testen ob JWT korrekt überprüft wird
        // und Beispiel zum Auslesen der Daten aus JWTs
        this.app.get('/getCurrentUser', this.authenticateJWT,
            (req: Request, res: Response) => {
                res.send(req.user);
            },
        );
        this.app.post('/createPerson', this.createPerson.bind(this));
        this.app.get('/getPersons', this.getPersons.bind(this));
        this.app.delete('/deletePerson/:personID', this.deletePerson.bind(this));
    }

    /**
     * getPersons
     * zeige alle Nutzer aus der Datenbank an
     */
    public async getPersons(req: Request, res: Response): Promise<void> {
        const persons = await this.personRepository.find();
        res.json(persons);
    }

    /**
     * createPerson
     * Erstellt eine neue Person
     */
    public async createPerson(req: Request, res: Response): Promise<void> {
        if (req.is("json") && req.body) {
            const newPerson = new Person(req.body);
            const person = await this.personRepository.create(newPerson);
            await this.personRepository.save(person);
            res.json(person);
        } else {
            res.status(400);
            res.send(
                "wrong format, only json allowed: {'firstName': 'string', 'lastName': 'string', 'birthday': Date}"
            );
        }
    }

    /**
     * deletePerson
     * Löscht eine Person aus der DB
     */
    public async deletePerson(req: Request, res: Response): Promise<void> {
        const personID = req.params.personID;
        const user = await this.personRepository.findOne(personID);
        if (user) {
            // sqlite treiber gibt leider keine antwort zurück ...
            await this.personRepository.delete(personID);
            res.send(`Person mit ID "${personID}" gelöscht`);
        } else {
            res.status(400)
            res.send("Person nicht gefunden")
        }
    }

    /**
     * startWebserver
     * startet den Webserver
     */
    public startWebserver(): void {
        this.app.listen(this.port, () => {
            console.log(`Server startet unter: http://localhost:${this.port}`);
        });
    }

    /**
     * authenticateJWT
     * prüft JWT auf Gültigkeit
     */
    public authenticateJWT(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET!,
                (err: any, user: any) => {
                    if (err) {
                        return res.sendStatus(403);
                    }

                    req.user = user;
                    next();
                },
            );
        } else {
            res.sendStatus(401);
        }
    }
}
