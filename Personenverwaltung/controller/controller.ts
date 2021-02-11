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
import { Query } from "./query";

dotenv.config();

export class Controller {
  app: Application;
  connection: Connection;
  port: number = 3004;
  apiPath: string = "/api/v1/personenverwaltung";
  // Repositories
  personRepository: Repository<Person>;
  fussballspielerRepository: Repository<Fussballspieler>;
  handballspielerRepository: Repository<Handballspieler>;
  tennisspielerRepository: Repository<Tennisspieler>;
  trainerRepository: Repository<Trainer>;
  physiotherapeutRepository: Repository<Physiotherapeut>;

  query: Query;
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
    this.query = new Query();
  }

  /**
   * useMiddleware
   * Funktionen die vor jeder Route ausgeführt werden soll
   */
  public useMiddleware(): void {
    //zum Loggen sämtlicher Zugriffe
    const infoLogger = (req: Request, res: Response, next: NextFunction) => {
      console.log(`Personenverwaltung: A ${req.method}-request was made by ${req.ip}`);
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

    // CREATE
    this.app.post(
      this.apiPath + "/persons",
      this.authenticateJWT,
      this.createOnePerson.bind(this)
    );

    // READ
    this.app.get(
      this.apiPath + "/persons",
      this.authenticateJWT,
      this.getAllPersons.bind(this)
    );
    this.app.get(
      this.apiPath + "/persons/:personId",
      this.authenticateJWT,
      this.getPersonById.bind(this)
    );

    // UPDATE
    this.app.put(
      this.apiPath + "/persons/:personId",
      this.authenticateJWT,
      this.updatePersonById.bind(this)
    );

    // DELETE
    this.app.delete(
      this.apiPath + "/persons/:personId",
      this.authenticateJWT,
      this.deletePersonById.bind(this)
    );
  }

  /**
   * getAllPersons
   * zeige alle Nutzer aus der Datenbank an
   */
  public async getAllPersons(req: Request, res: Response): Promise<void> {
    let persons = [
      ...(await this.query.qGetPersons(
        this.personRepository,
        "fussballspieler"
      )),
      ...(await this.query.qGetPersons(
        this.personRepository,
        "handballspieler"
      )),
      ...(await this.query.qGetPersons(this.personRepository, "tennisspieler")),
      ...(await this.query.qGetPersons(this.personRepository, "trainer")),
      ...(await this.query.qGetPersons(
        this.personRepository,
        "physiotherapeut"
      )),
    ];

    res.json(persons);
  }

  /**
   * getPersonById
   * zeige einen Nutzer aus der Datenbank an
   */
  public async getPersonById(req: Request, res: Response): Promise<void> {
    try {
      const person = await this.personRepository.findOne(req.params.personId);
      const persons = await this.query.qGetPersonById(
        this.personRepository,
        person.type,
        person.id
      );
      res.json(persons);
    } catch (err) {
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
  public async createOnePerson(req: Request, res: Response): Promise<void> {
    if (req.is("json") && req.body) {
      let person, result, personType;
      person = new Person(req.body);
      await this.personRepository.save(person);

      switch (req.body.type) {
        case "fussballspieler":
          personType = new Fussballspieler(req.body);
          personType.person = person;
          result = await this.fussballspielerRepository.save(personType);
          break;
        case "handballspieler":
          personType = new Handballspieler(req.body);
          personType.person = person;
          result = await this.handballspielerRepository.save(personType);
          break;
        case "tennisspieler":
          personType = new Tennisspieler(req.body);
          personType.person = person;
          result = await this.tennisspielerRepository.save(personType);
          break;
        case "trainer":
          personType = new Trainer(req.body);
          personType.person = person;
          result = await this.trainerRepository.save(personType);
          break;
        case "physiotherapeut":
          personType = new Physiotherapeut(req.body);
          personType.person = person;
          result = await this.physiotherapeutRepository.save(personType);
          break;
        default:
          res.status(406).send("No such person type");
          break;
      }
      res.status(200).json(result);
    } else {
      res
        .status(400)
        .send(
          "wrong format, only json allowed: {'firstName': 'string', 'lastName': 'string', 'birthday': Date}"
        );
    }
  }

  /**
   * deletePerson
   * Löscht eine Person aus der DB
   */
  public async deletePersonById(req: Request, res: Response): Promise<void> {
    try {
      await this.personRepository.delete(req.params.personId);
      res.send(`Person with ID "${req.params.personId}" has been deleted`);
    } catch (err) {
      res
        .status(400)
        .send({ error: err, message: "Person could not be deleted." });
    }
  }

  public async updatePersonById(req: Request, res: Response): Promise<void> {
    if (req.is("json") && req.body) {
      try {
        const person = await this.personRepository.findOne(req.params.personId);
        let typeProperties = person[person.type],
          resultType;

        switch (person.type) {
          case "fussballspieler":
            this.fussballspielerRepository.merge(typeProperties, req.body);
            resultType = await this.fussballspielerRepository.save(
              typeProperties
            );
            break;
          case "handballspieler":
            this.handballspielerRepository.merge(typeProperties, req.body);
            resultType = await this.handballspielerRepository.save(
              typeProperties
            );
            break;
          case "tennisspieler":
            this.tennisspielerRepository.merge(typeProperties, req.body);
            resultType = await this.tennisspielerRepository.save(
              typeProperties
            );
            break;
          case "trainer":
            this.trainerRepository.merge(typeProperties, req.body);
            resultType = await this.trainerRepository.save(typeProperties);
            break;
          case "physiotherapeut":
            this.physiotherapeutRepository.merge(typeProperties, req.body);
            resultType = await this.physiotherapeutRepository.save(
              typeProperties
            );
            break;
          default:
            res.status(406).send("No such person type");
            break;
        }

        this.personRepository.merge(person, req.body);
        const resultPerson = await this.personRepository.save(person);

        resultPerson[person.type] = resultType;

        res.status(200).json(resultPerson);
      } catch (err) {
        res
          .status(400)
          .send({ error: err, message: "Person could not be updated." });
      }
    } else {
      res
        .status(400)
        .send(
          "wrong format, only json allowed: {'firstName': 'string', 'lastName': 'string', 'birthday': Date}"
        );
    }
  }

  /**
   * startWebserver
   * startet den Webserver
   */
  public startWebserver(): void {
    this.app.listen(this.port, () => {
      console.log(`Personenverwaltung: Server startet unter: http://localhost:${this.port}`);
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
