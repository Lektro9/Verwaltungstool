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
const person_entity_1 = require("../model/person.entity");
const handballspieler_entity_1 = require("../model/handballspieler.entity");
const fussballspieler_entity_1 = require("../model/fussballspieler.entity");
const tennisspieler_entity_1 = require("../model/tennisspieler.entity");
const trainer_entity_1 = require("../model/trainer.entity");
const physiotherapeut_entity_1 = require("../model/physiotherapeut.entity");
const query_1 = require("./query");
dotenv_1.default.config();
class Controller {
    constructor() {
        this.port = 3004;
        this.apiPath = "/api/v1/personenverwaltung";
        typeorm_1.createConnection().then((connection) => {
            this.connection = connection;
            this.personRepository = this.connection.getRepository(person_entity_1.Person);
            this.fussballspielerRepository = this.connection.getRepository(fussballspieler_entity_1.Fussballspieler);
            this.handballspielerRepository = this.connection.getRepository(handballspieler_entity_1.Handballspieler);
            this.tennisspielerRepository = this.connection.getRepository(tennisspieler_entity_1.Tennisspieler);
            this.trainerRepository = this.connection.getRepository(trainer_entity_1.Trainer);
            this.physiotherapeutRepository = this.connection.getRepository(physiotherapeut_entity_1.Physiotherapeut);
        });
        this.app = express_1.default();
        this.query = new query_1.Query();
    }
    /**
     * useMiddleware
     * Funktionen die vor jeder Route ausgeführt werden soll
     */
    useMiddleware() {
        //zum Loggen sämtlicher Zugriffe
        const infoLogger = (req, res, next) => {
            console.log(`A ${req.method}-request was made by ${req.ip}`);
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
        this.app.get("/getCurrentUser", this.authenticateJWT, (req, res) => {
            res.send(req.user);
        });
        // CREATE
        this.app.post(this.apiPath + "/persons", this.authenticateJWT, this.createOnePerson.bind(this));
        // READ
        this.app.get(this.apiPath + "/persons", this.authenticateJWT, this.getAllPersons.bind(this));
        this.app.get(this.apiPath + "/persons/:personId", this.authenticateJWT, this.getPersonById.bind(this));
        // UPDATE
        this.app.put(this.apiPath + "/persons/:personId", this.authenticateJWT, this.updatePersonById.bind(this));
        // DELETE
        this.app.delete(this.apiPath + "/persons/:personId", this.authenticateJWT, this.deletePersonById.bind(this));
    }
    /**
     * getAllPersons
     * zeige alle Nutzer aus der Datenbank an
     */
    async getAllPersons(req, res) {
        let persons = [
            ...(await this.query.qGetPersons(this.personRepository, "fussballspieler")),
            ...(await this.query.qGetPersons(this.personRepository, "handballspieler")),
            ...(await this.query.qGetPersons(this.personRepository, "tennisspieler")),
            ...(await this.query.qGetPersons(this.personRepository, "trainer")),
            ...(await this.query.qGetPersons(this.personRepository, "physiotherapeut")),
        ];
        res.json(persons);
    }
    /**
     * getPersonById
     * zeige einen Nutzer aus der Datenbank an
     */
    async getPersonById(req, res) {
        try {
            const person = await this.personRepository.findOne(req.params.personId);
            const persons = await this.query.qGetPersonById(this.personRepository, person.type, person.id);
            res.json(persons);
        }
        catch (err) {
            res.status(404).send({
                error: err,
                message: `Person with Id ${req.params.personId} is not available.`,
            });
            console.error(err);
        }
    }
    /**
     * createOnePerson
     * Erstellt eine neue Person
     */
    async createOnePerson(req, res) {
        if (req.is("json") && req.body) {
            let person, result, personType;
            person = new person_entity_1.Person(req.body);
            await this.personRepository.save(person);
            switch (req.body.type) {
                case "fussballspieler":
                    personType = new fussballspieler_entity_1.Fussballspieler(req.body);
                    personType.person = person;
                    result = await this.fussballspielerRepository.save(personType);
                    break;
                case "handballspieler":
                    personType = new handballspieler_entity_1.Handballspieler(req.body);
                    personType.person = person;
                    result = await this.handballspielerRepository.save(personType);
                    break;
                case "tennisspieler":
                    personType = new tennisspieler_entity_1.Tennisspieler(req.body);
                    personType.person = person;
                    result = await this.tennisspielerRepository.save(personType);
                    break;
                case "trainer":
                    personType = new trainer_entity_1.Trainer(req.body);
                    personType.person = person;
                    result = await this.trainerRepository.save(personType);
                    break;
                case "physiotherapeut":
                    personType = new physiotherapeut_entity_1.Physiotherapeut(req.body);
                    personType.person = person;
                    result = await this.physiotherapeutRepository.save(personType);
                    break;
                default:
                    res.status(406).send("No such person type");
                    break;
            }
            res.status(200).json(result);
        }
        else {
            res
                .status(400)
                .send("wrong format, only json allowed: {'firstName': 'string', 'lastName': 'string', 'birthday': Date}");
        }
    }
    /**
     * deletePerson
     * Löscht eine Person aus der DB
     */
    async deletePersonById(req, res) {
        try {
            await this.personRepository.delete(req.params.personId);
            res.send(`Person with ID "${req.params.personId}" has been deleted`);
        }
        catch (err) {
            res
                .status(400)
                .send({ error: err, message: "Person could not be deleted." });
        }
    }
    async updatePersonById(req, res) {
        if (req.is("json") && req.body) {
            try {
                const person = await this.personRepository.findOne(req.params.personId);
                let typeProperties = person[person.type], resultType;
                switch (person.type) {
                    case "fussballspieler":
                        this.fussballspielerRepository.merge(typeProperties, req.body);
                        resultType = await this.fussballspielerRepository.save(typeProperties);
                        break;
                    case "handballspieler":
                        this.handballspielerRepository.merge(typeProperties, req.body);
                        resultType = await this.handballspielerRepository.save(typeProperties);
                        break;
                    case "tennisspieler":
                        this.tennisspielerRepository.merge(typeProperties, req.body);
                        resultType = await this.tennisspielerRepository.save(typeProperties);
                        break;
                    case "trainer":
                        this.trainerRepository.merge(typeProperties, req.body);
                        resultType = await this.trainerRepository.save(typeProperties);
                        break;
                    case "physiotherapeut":
                        this.physiotherapeutRepository.merge(typeProperties, req.body);
                        resultType = await this.physiotherapeutRepository.save(typeProperties);
                        break;
                    default:
                        res.status(406).send("No such person type");
                        break;
                }
                this.personRepository.merge(person, req.body);
                const resultPerson = await this.personRepository.save(person);
                resultPerson[person.type] = resultType;
                res.status(200).json(resultPerson);
            }
            catch (err) {
                res
                    .status(400)
                    .send({ error: err, message: "Person could not be updated." });
            }
        }
        else {
            res
                .status(400)
                .send("wrong format, only json allowed: {'firstName': 'string', 'lastName': 'string', 'birthday': Date}");
        }
    }
    /**
     * startWebserver
     * startet den Webserver
     */
    startWebserver() {
        this.app.listen(this.port, () => {
            console.log(`Server startet unter: http://localhost:${this.port}`);
        });
    }
    /**
     * authenticateJWT
     * prüft JWT auf Gültigkeit
     */
    authenticateJWT(req, res, next) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(" ")[1];
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
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map