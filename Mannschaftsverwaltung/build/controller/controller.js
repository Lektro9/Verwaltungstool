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
const mannschaft_1 = require("../model/mannschaft");
const mannschaftMitglieder_1 = require("../model/mannschaftMitglieder");
dotenv_1.default.config();
class Controller {
    constructor() {
        typeorm_1.createConnection().then((connection) => {
            this.connection = connection;
            this.mannschaftRepository = this.connection.getRepository(mannschaft_1.Mannschaft);
            this.mitgliederRepository = this.connection.getRepository(mannschaftMitglieder_1.MannschaftMitglied);
        });
        this.app = express_1.default();
        this.port = 3006;
    }
    /**
     * useMiddleware
     * Funktionen die vor jeder Route ausgeführt werden soll
     */
    useMiddleware() {
        //zum Loggen sämtlicher Zugriffe
        const infoLogger = (req, res, next) => {
            console.log(`Mannschaftsverwaltung: A ${req.method}-request was made by ${req.ip}`);
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
        this.app.post('/createMannschaft', [this.authenticateJWT, this.isUserAdmin], this.createMannschaft.bind(this));
        this.app.put('/addToMannschaft', [this.authenticateJWT, this.isUserAdmin], this.addToMannschaft.bind(this));
        this.app.put('/removeFromMannschaft', [this.authenticateJWT, this.isUserAdmin], this.removeFromMannschaft.bind(this));
        this.app.get('/getMannschaften', this.authenticateJWT, this.getMannschaften.bind(this));
        this.app.get('/getMannschaftsMitglieder', this.authenticateJWT, this.getMannschaftsMitglieder.bind(this));
        this.app.get('/getMannschaft/:mannID', this.authenticateJWT, this.getMannschaft.bind(this));
        this.app.delete('/deleteMannschaft/:mannID', [this.authenticateJWT, this.isUserAdmin], this.deleteMannschaft.bind(this));
    }
    /**
     * getMannschaften
     * zeige alle Mannschaften aus der Datenbank an
     */
    async getMannschaften(req, res) {
        const mannschaften = await this.mannschaftRepository.find({
            relations: ['mitglieder'],
        });
        res.json(mannschaften);
    }
    /**
     * getMannschaft
     * zeige eine Mannschaft aus der Datenbank an
     */
    async getMannschaft(req, res) {
        const mannID = req.params.mannID;
        const mannschaft = await this.mannschaftRepository.findOne(mannID, {
            relations: ['mitglieder'],
        });
        res.json(mannschaft);
    }
    async addToMannschaft(req, res) {
        if (req.is('json') && req.body) {
            const { mannschaftID, personenIDs } = req.body;
            const mannschaft = await this.mannschaftRepository.findOne(mannschaftID, {
                relations: ['mitglieder'],
            });
            for (const id of personenIDs) {
                const newMitglied = new mannschaftMitglieder_1.MannschaftMitglied();
                newMitglied.personenId = id;
                await this.mitgliederRepository.save(newMitglied);
                mannschaft.mitglieder.push(newMitglied);
            }
            await this.mannschaftRepository.save(mannschaft);
            res.json(mannschaft);
        }
        else {
            res.status(400);
            res.send("wrong format, only json allowed: {'mannschaftID': 2, 'teilnehmerIDs': [1,2,3]}");
        }
    }
    /**
     * removeFromMannschaft
     * entferne Person aus Mannschaft
     */
    async removeFromMannschaft(req, res) {
        if (req.is('json') && req.body) {
            const { mannschaftID, personenID } = req.body;
            const mannschaft = await this.mannschaftRepository.findOne(mannschaftID, {
                relations: ['mitglieder'],
            });
            mannschaft.mitglieder = mannschaft.mitglieder.filter((person) => person.personenId !== personenID);
            // in MitgliederTabelle aufräumen ...
            await this.mitgliederRepository.delete(personenID);
            await this.mannschaftRepository.save(mannschaft);
            res.json(mannschaft);
        }
        else {
            res.status(400);
            res.send("wrong format, only json allowed");
        }
    }
    async getMannschaftsMitglieder(req, res) {
        const mitglieder = await this.mannschaftRepository.find({
            relations: ['mitglieder'],
        });
        res.send(mitglieder);
    }
    /**
     * createMannschaft
     * Erstellt eine neue Mannschaft
     */
    async createMannschaft(req, res) {
        //TODO: better typechecking?
        if (req.is('json') && req.body) {
            const newMannschaft = new mannschaft_1.Mannschaft(req.body);
            const createdMannschaft = await this.mannschaftRepository.create(newMannschaft);
            const savedMannschaft = await this.mannschaftRepository.save(createdMannschaft);
            const modiefiedMannschaft = await this.mannschaftRepository.findOne(savedMannschaft.id, {
                relations: ['mitglieder'],
            });
            const personIds = req.body.mitglieder;
            for (const id of personIds) {
                const newMitglied = new mannschaftMitglieder_1.MannschaftMitglied();
                newMitglied.personenId = id;
                await this.mitgliederRepository.save(newMitglied);
                modiefiedMannschaft.mitglieder.push(newMitglied);
            }
            await this.mannschaftRepository.save(modiefiedMannschaft);
            res.json(modiefiedMannschaft);
        }
        else {
            res.status(400);
            res.send('wrong format, only json allowed');
        }
    }
    /**
     * deleteMannschaft
     * Löscht eine Mannschaft aus der DB
     */
    async deleteMannschaft(req, res) {
        const mannID = req.params.mannID;
        const mannschaft = await this.mannschaftRepository.findOne(mannID);
        if (mannschaft) {
            // sqlite treiber gibt leider keine antwort zurück ...
            await this.mannschaftRepository.delete(mannID);
            res.send(`Mannschaft mit ID "${mannID}" gelöscht`);
        }
        else {
            res.status(400);
            res.send('Mannschaft nicht gefunden');
        }
    }
    /**
     * startWebserver
     * startet den Webserver
     */
    startWebserver() {
        this.app.listen(this.port, () => {
            console.log(`Mannschaftsverwaltung: Server startet unter: http://localhost:${this.port}`);
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
     * prüft ob nutzer aus dem tvaliden Token nötige Rechte besitzt
     */
    isUserAdmin(req, res, next) {
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