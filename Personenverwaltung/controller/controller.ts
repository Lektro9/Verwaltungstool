import express, { Application, NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "reflect-metadata";
import { createConnection, Repository, Connection } from "typeorm";
import cors from "cors";
import dotenv from "dotenv";
import { Person } from "../model/person.entity";
import { Handballspieler } from "../model/handballspieler.entity";
import { Fussballspieler } from "../model/fussballspieler.entity";
import { Tennisspieler } from "../model/tennisspieler.entity";
import { Trainer } from "../model/trainer.entity";
import { Physiotherapeut } from "../model/physiotherapeut.entity";

dotenv.config();

export class Controller {
  app: Application;
  connection: Connection;
  port: number;
  apiPath: string = "/api/v1/personenverwaltung";
  // Repositories
  personRepository: Repository<Person>;
  fussballspielerRepository: Repository<Fussballspieler>;
  handballspielerRepository: Repository<Handballspieler>;
  tennisspielerRepository: Repository<Tennisspieler>;
  trainerRepository: Repository<Trainer>;
  physiotherapeutRepository: Repository<Physiotherapeut>;

  constructor() {
    createConnection().then((connection) => {
      this.connection = connection;
      this.personRepository = this.connection.getRepository(Person);
      this.fussballspielerRepository = this.connection.getRepository(
        Fussballspieler
      );
      this.handballspielerRepository = this.connection.getRepository(
        Handballspieler
      );
      this.tennisspielerRepository = this.connection.getRepository(
        Tennisspieler
      );
      this.trainerRepository = this.connection.getRepository(Trainer);
      this.physiotherapeutRepository = this.connection.getRepository(
        Physiotherapeut
      );
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
    this.app.get(
      "/getCurrentUser",
      this.authenticateJWT,
      (req: Request, res: Response) => {
        res.send(req.user);
      }
    );
    this.app.post(this.apiPath + "/persons", this.createOnePerson.bind(this));
    this.app.get(this.apiPath + "/persons", this.getAllPersons.bind(this));
    this.app.get(
      this.apiPath + "/persons/:personId",
      this.getPersonById.bind(this)
    );
    this.app.delete(
      this.apiPath + "/persons/:personId",
      this.deletePerson.bind(this)
    );
    this.app.put(
      this.apiPath + "/persons/:personId",
      this.updateOnePerson.bind(this)
    );
  }

  /**
   * getAllPersons
   * zeige alle Nutzer aus der Datenbank an
   */
  public async getAllPersons(req: Request, res: Response): Promise<void> {
    const persons = await this.personRepository.find();
    res.json(persons);
  }

  /**
   * getPersonById
   * zeige einen Nutzer aus der Datenbank an
   */
  public async getPersonById(req: Request, res: Response): Promise<void> {
    const persons = await this.personRepository.findOne(req.params.personId);
    res.json(persons);
  }

  /**
   * createOnePerson
   * Erstellt eine neue Person
   */
  public async createOnePerson(req: Request, res: Response): Promise<void> {
    if (req.is("json") && req.body) {
      let person, result;
      let type = req.body.type;
      delete req.body.type;
      switch (type) {
        case "fussballspieler":
          person = new Fussballspieler(req.body);
          result = this.fussballspielerRepository.create(person);
          await this.fussballspielerRepository.save(person);
          break;
        case "handballspieler":
          person = new Handballspieler(req.body);
          result = this.handballspielerRepository.create(person);
          await this.handballspielerRepository.save(person);
          break;
        case "tennisspieler":
          person = new Tennisspieler(req.body);
          result = this.tennisspielerRepository.create(person);
          await this.tennisspielerRepository.save(person);
          break;
        case "trainer":
          person = new Trainer(req.body);
          result = this.trainerRepository.create(person);
          await this.trainerRepository.save(person);
          break;
        case "physiotherapeut":
          person = new Physiotherapeut(req.body);
          result = this.physiotherapeutRepository.create(person);
          await this.physiotherapeutRepository.save(person);
          break;
        default:
          res.status(400);
          res.send("No such person type");
          break;
      }

      res.json(result);
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
      res.status(400);
      res.send("Person nicht gefunden");
    }
  }

  public async updateOnePerson(req: Request, res: Response): Promise<void> {
    const person = await this.personRepository.findOne(req.params.personId);
    if (person) {
      if (req.is("json") && req.body) {
        const results = await this.personRepository.merge(person, req.body);
        res.json(results);
      } else {
        res.status(400);
        res.send(
          "wrong format, only json allowed: {'firstName': 'string', 'lastName': 'string', 'birthday': Date}"
        );
      }
    } else {
      res.status(400);
      res.send("Person nicht gefunden");
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
  public authenticateJWT(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
        (err: any, user: any) => {
          if (err) {
            return res.sendStatus(403);
          }

          req.user = user;
          next();
        }
      );
    } else {
      res.sendStatus(401);
    }
  }
}
