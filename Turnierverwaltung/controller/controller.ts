import express, { Application, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'reflect-metadata';
import { createConnection, Repository, Connection } from 'typeorm';
import cors from 'cors';
import dotenv from 'dotenv';
import { Turnier } from '../model/turnier';
import { TurnierTeilnehmer } from '../model/turnierTeilnehmer';
import { Spiel } from '../model/spiel';

dotenv.config();

export class Controller {
    app: Application
    turnierRepository: Repository<Turnier>
    teilnehmerRepository: Repository<TurnierTeilnehmer>
    spieleRepository: Repository<Spiel>
    connection: Connection
    port: number

    constructor() {
        createConnection().then((connection) => {
            this.connection = connection;
            this.turnierRepository = this.connection.getRepository(Turnier);
            this.teilnehmerRepository = this.connection.getRepository(TurnierTeilnehmer);
            this.spieleRepository = this.connection.getRepository(Spiel);
        });
        this.app = express();
        this.port = 3007;
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
        this.app.post('/createTurnier', [this.authenticateJWT, this.isUserAdmin], this.createTurnier.bind(this));
        this.app.get('/getTurniere', this.authenticateJWT, this.getTurniere.bind(this));
        this.app.delete('/deleteTurnier/:turnierID', [this.authenticateJWT, this.isUserAdmin], this.deleteTurnier.bind(this));
        this.app.post('/addTeilnehmerToTurnier', [this.authenticateJWT, this.isUserAdmin], this.addTeilnehmerToTurnier.bind(this));
        this.app.delete('/removeTeilnehmerFromTurnier', [this.authenticateJWT, this.isUserAdmin], this.removeTeilnehmerFromTurnier.bind(this));
        this.app.post('/addSpielToTurnier', [this.authenticateJWT, this.isUserAdmin], this.addSpielToTurnier.bind(this));
        this.app.delete('/removeSpielFromTurnier/:gameID', [this.authenticateJWT, this.isUserAdmin], this.removeSpielFromTurnier.bind(this));
    }

    /**
     * getTurniere
     * zeige alle Mannschaften aus der Datenbank an
     */
    public async getTurniere(req: Request, res: Response): Promise<void> {
        const persons = await this.turnierRepository.find({ relations: ["teilnehmer", "games"] });
        res.json(persons);
    }

    /**
     * createTurnier
     * Erstellt ein neues Turnier
     */
    public async createTurnier(req: Request, res: Response): Promise<void> {
        //TODO: better typechecking?
        if (req.is("json") && req.body) {
            const newTurnier = new Turnier(req.body);
            const turnier = await this.turnierRepository.create(newTurnier);
            await this.turnierRepository.save(turnier);
            const retTurnier = await this.turnierRepository.findOne(turnier.id, { relations: ["teilnehmer", "games"] });
            res.json(retTurnier);
        } else {
            res.status(400);
            res.send(
                "wrong format, only json allowed: {'firstName': 'string', 'lastName': 'string', 'birthday': Date}"
            );
        }
    }

    /**
     * addTeilnehmerToTurnier
     * einen oder mehrere Teilnehmer einem Turnier zuteilen
     */
    public async addTeilnehmerToTurnier(req: Request, res: Response): Promise<void> {
        if (req.is("json") && req.body) {
            const { turnierID, teilnehmerIDs } = req.body;
            const turnier = await this.turnierRepository.findOne(turnierID, { relations: ["teilnehmer"] });
            for (const id of teilnehmerIDs) {
                const newTeilnehmer = new TurnierTeilnehmer();
                newTeilnehmer.mannschaftID = id;
                await this.teilnehmerRepository.save(newTeilnehmer)
                turnier.teilnehmer.push(newTeilnehmer)
            }
            await this.turnierRepository.save(turnier);
            res.json(turnier);
        } else {
            res.status(400);
            res.send(
                "wrong format, only json allowed: {'turnierID': 2, 'teilnehmerIDs': [1,2,3]}"
            );
        }
    }

    /**
    * addSpielToTurnier
    * ein Spiel einem Turnier zuteilen
    */
    public async addSpielToTurnier(req: Request, res: Response): Promise<void> {
        if (req.is("json") && req.body) {
            const { turnierID, game } = req.body;
            const turnier = await this.turnierRepository.findOne(turnierID, { relations: ["teilnehmer", "games"] });

            const newSpiel = new Spiel(game);
            await this.spieleRepository.save(newSpiel)
            turnier.games.push(newSpiel)

            await this.turnierRepository.save(turnier);
            res.json(turnier);
        } else {
            res.status(400);
            res.send(
                "wrong format, only json allowed: {'turnierID': 2, 'teilnehmerIDs': [1,2,3]}"
            );
        }
    }

    /**
    * removeSpielFromTurnier
    * ein Spiel einem Turnier entfernen
    */
    public async removeSpielFromTurnier(req: Request, res: Response): Promise<void> {
        const { gameID } = req.params;
        const spiel = await this.spieleRepository.findOne(gameID);
        if (spiel) {
            // sqlite treiber gibt leider keine antwort zurück ...
            await this.spieleRepository.delete(gameID);
            res.send(`Spiel mit ID "${gameID}" gelöscht`);
        } else {
            res.status(400)
            res.send("Spiel nicht gefunden")
        }
    }

    /**
    * removeTeilnehmerFromTurnier
    * Teilnehmer mit den verbundenen Spielen aus dem Turnier entfernen
    */
    public async removeTeilnehmerFromTurnier(req: Request, res: Response): Promise<void> {
        const { turnierID, teilnehmerIDs } = req.body;
        if (req.is("json") && req.body) {
            const turnier = await this.turnierRepository.findOne(turnierID, { relations: ['teilnehmer', 'games'] });
            const teilnehmerToBeDeleted = [];
            const gamesToBeDeleted = [];
            for (const id of teilnehmerIDs) {
                turnier.teilnehmer = turnier.teilnehmer.filter((mannschaft) => {
                    if (mannschaft.mannschaftID !== id) {
                        return mannschaft;
                    } else {
                        teilnehmerToBeDeleted.push(mannschaft);
                    }
                })
                turnier.games = turnier.games.filter((spiel) => {
                    if (spiel.team1Id !== id && spiel.team2Id !== id) {
                        return spiel;
                    } else {
                        gamesToBeDeleted.push(spiel);
                    }
                })
            }

            // aufräumen in der Teilnehmertabelle
            if (teilnehmerToBeDeleted.length > 0)
                await this.teilnehmerRepository.delete(teilnehmerToBeDeleted);

            // aufräumen in der SpieleTabelle
            if (gamesToBeDeleted.length > 0)
                await this.spieleRepository.delete(gamesToBeDeleted);

            // neues Turnierobjekt abspeichern
            const newTurnier = await this.turnierRepository.save(turnier);
            res.send(newTurnier)
        } else {
            res.status(400);
            res.send(
                "wrong format, only json allowed: {'turnierID': 2, 'teilnehmerIDs': [1,2,3]}"
            );
        }

    }

    /**
     * deleteTurnier
     * Löscht ein Turnier aus der DB
     */
    public async deleteTurnier(req: Request, res: Response): Promise<void> {
        const turnierID = req.params.turnierID;
        const turnier = await this.turnierRepository.findOne(turnierID);
        if (turnier) {
            // sqlite treiber gibt leider keine antwort zurück ...
            await this.turnierRepository.delete(turnierID);
            res.send(`Turnier mit ID "${turnierID}" gelöscht`);
        } else {
            res.status(400)
            res.send("Turnier nicht gefunden")
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

    /**
    * isUserAdmin
    * prüft ob nutzer aus dem validen Token nötige Rechte besitzt
    */
    public isUserAdmin(
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        console.log(req.user)
        if (req.user.role) {
            next();
        } else {
            res.sendStatus(401);
        }
    }
}
