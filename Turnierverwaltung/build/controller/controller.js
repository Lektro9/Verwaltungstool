"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const turnier_1 = require("../model/turnier");
const turnierTeilnehmer_1 = require("../model/turnierTeilnehmer");
const spiel_1 = require("../model/spiel");
dotenv_1.default.config();
class Controller {
    constructor() {
        typeorm_1.createConnection().then((connection) => {
            this.connection = connection;
            this.turnierRepository = this.connection.getRepository(turnier_1.Turnier);
            this.teilnehmerRepository = this.connection.getRepository(turnierTeilnehmer_1.TurnierTeilnehmer);
            this.spieleRepository = this.connection.getRepository(spiel_1.Spiel);
        });
        this.app = express_1.default();
        this.port = 3007;
    }
    /**
     * useMiddleware
     * Funktionen die vor jeder Route ausgeführt werden soll
     */
    useMiddleware() {
        //zum Loggen sämtlicher Zugriffe
        const infoLogger = (req, res, next) => {
            console.log(`Turnierverwaltung: A ${req.method}-request was made by ${req.ip}`);
            next();
        };
        this.app.use(infoLogger);
        //erlaubt Webserver jsons zu empfangen
        this.app.use(express_1.default.json());
        //setzt CORS Header 'Access-Control-Allow-Origin' und welche REST-Methoden von wem genutzt werden dürfen
        //hier: alle dürfen alles
        this.app.use(cors_1.default());
    }
    /**
     * createRoutes
     *
     * Definiert Routen, Methoden und deren zugehörige Funktionen
     *
     * bind() wird benötigt wenn Eigenschaften aus dieser Klasse verwendet werden
     * müssen
     */
    createRoutes() {
        // testen ob JWT korrekt überprüft wird
        // und Beispiel zum Auslesen der Daten aus JWTs
        this.app.get('/getCurrentUser', this.authenticateJWT, (req, res) => {
            res.send(req.user);
        });
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
    async getTurniere(req, res) {
        const persons = await this.turnierRepository.find({ relations: ["teilnehmer", "games"] });
        res.json(persons);
    }
    /**
     * createTurnier
     * Erstellt ein neues Turnier
     */
    async createTurnier(req, res) {
        //TODO: better typechecking?
        if (req.is("json") && req.body) {
            const newTurnier = new turnier_1.Turnier(req.body);
            const turnier = await this.turnierRepository.create(newTurnier);
            await this.turnierRepository.save(turnier);
            const retTurnier = await this.turnierRepository.findOne(turnier.id, { relations: ["teilnehmer", "games"] });
            res.json(retTurnier);
        }
        else {
            res.status(400);
            res.send("wrong format, only json allowed: {'firstName': 'string', 'lastName': 'string', 'birthday': Date}");
        }
    }
    /**
     * addTeilnehmerToTurnier
     * einen oder mehrere Teilnehmer einem Turnier zuteilen
     */
    async addTeilnehmerToTurnier(req, res) {
        if (req.is("json") && req.body) {
            const { turnierID, teilnehmerIDs } = req.body;
            const turnier = await this.turnierRepository.findOne(turnierID, { relations: ["teilnehmer"] });
            for (const id of teilnehmerIDs) {
                const newTeilnehmer = new turnierTeilnehmer_1.TurnierTeilnehmer();
                newTeilnehmer.mannschaftID = id;
                await this.teilnehmerRepository.save(newTeilnehmer);
                turnier.teilnehmer.push(newTeilnehmer);
            }
            await this.turnierRepository.save(turnier);
            res.json(turnier);
        }
        else {
            res.status(400);
            res.send("wrong format, only json allowed: {'turnierID': 2, 'teilnehmerIDs': [1,2,3]}");
        }
    }
    /**
    * addSpielToTurnier
    * ein Spiel einem Turnier zuteilen
    */
    async addSpielToTurnier(req, res) {
        if (req.is("json") && req.body) {
            const { turnierID, game } = req.body;
            const turnier = await this.turnierRepository.findOne(turnierID, { relations: ["teilnehmer", "games"] });
            const newSpiel = new spiel_1.Spiel(game);
            await this.spieleRepository.save(newSpiel);
            turnier.games.push(newSpiel);
            await this.turnierRepository.save(turnier);
            res.json(turnier);
        }
        else {
            res.status(400);
            res.send("wrong format, only json allowed: {'turnierID': 2, 'teilnehmerIDs': [1,2,3]}");
        }
    }
    /**
    * removeSpielFromTurnier
    * ein Spiel einem Turnier entfernen
    */
    async removeSpielFromTurnier(req, res) {
        const { gameID } = req.params;
        const spiel = await this.spieleRepository.findOne(gameID);
        if (spiel) {
            // sqlite treiber gibt leider keine antwort zurück ...
            await this.spieleRepository.delete(gameID);
            res.send(`Spiel mit ID "${gameID}" gelöscht`);
        }
        else {
            res.status(400);
            res.send("Spiel nicht gefunden");
        }
    }
    /**
    * removeTeilnehmerFromTurnier
    * Teilnehmer mit den verbundenen Spielen aus dem Turnier entfernen
    */
    async removeTeilnehmerFromTurnier(req, res) {
        const { turnierID, teilnehmerIDs } = req.body;
        if (req.is("json") && req.body) {
            const turnier = await this.turnierRepository.findOne(turnierID, { relations: ['teilnehmer', 'games'] });
            const teilnehmerToBeDeleted = [];
            const gamesToBeDeleted = [];
            for (const id of teilnehmerIDs) {
                turnier.teilnehmer = turnier.teilnehmer.filter((mannschaft) => {
                    if (mannschaft.mannschaftID !== id) {
                        return mannschaft;
                    }
                    else {
                        teilnehmerToBeDeleted.push(mannschaft);
                    }
                });
                turnier.games = turnier.games.filter((spiel) => {
                    if (spiel.team1Id !== id && spiel.team2Id !== id) {
                        return spiel;
                    }
                    else {
                        gamesToBeDeleted.push(spiel);
                    }
                });
            }
            // aufräumen in der Teilnehmertabelle
            if (teilnehmerToBeDeleted.length > 0)
                await this.teilnehmerRepository.delete(teilnehmerToBeDeleted);
            // aufräumen in der SpieleTabelle
            if (gamesToBeDeleted.length > 0)
                await this.spieleRepository.delete(gamesToBeDeleted);
            // neues Turnierobjekt abspeichern
            const newTurnier = await this.turnierRepository.save(turnier);
            res.send(newTurnier);
        }
        else {
            res.status(400);
            res.send("wrong format, only json allowed: {'turnierID': 2, 'teilnehmerIDs': [1,2,3]}");
        }
    }
    /**
     * deleteTurnier
     * Löscht ein Turnier aus der DB
     */
    async deleteTurnier(req, res) {
        const turnierID = req.params.turnierID;
        const turnier = await this.turnierRepository.findOne(turnierID);
        if (turnier) {
            // sqlite treiber gibt leider keine antwort zurück ...
            await this.turnierRepository.delete(turnierID);
            res.send(`Turnier mit ID "${turnierID}" gelöscht`);
        }
        else {
            res.status(400);
            res.send("Turnier nicht gefunden");
        }
    }
    /**
     * startWebserver
     * startet den Webserver
     */
    startWebserver() {
        this.app.listen(this.port, () => {
            console.log(`Turnierverwaltung: Server startet unter: http://localhost:${this.port}`);
        });
    }
    /**
     * authenticateJWT
     * prüft JWT auf Gültigkeit
     */
    authenticateJWT(req, res, next) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }
                req.user = user;
                next();
            });
        }
        else {
            res.sendStatus(401);
        }
    }
    /**
    * isUserAdmin
    * prüft ob nutzer aus dem validen Token nötige Rechte besitzt
    */
    isUserAdmin(req, res, next) {
        console.log(req.user);
        if (req.user.role) {
            next();
        }
        else {
            res.sendStatus(401);
        }
    }
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map