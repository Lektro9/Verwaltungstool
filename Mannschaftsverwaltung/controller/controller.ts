import express, { Application, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'reflect-metadata';
import { createConnection, Repository, Connection } from 'typeorm';
import cors from 'cors';
import dotenv from 'dotenv';
import { Mannschaft } from '../model/mannschaft';
import { MannschaftMitglied } from '../model/mannschaftMitglieder';

dotenv.config();

export class Controller {
  app: Application;
  mannschaftRepository: Repository<Mannschaft>;
  mitgliederRepository: Repository<MannschaftMitglied>;
  connection: Connection;
  port: number;

  constructor() {
    createConnection().then((connection) => {
      this.connection = connection;
      this.mannschaftRepository = this.connection.getRepository(Mannschaft);
      this.mitgliederRepository = this.connection.getRepository(
        MannschaftMitglied
      );
    });
    this.app = express();
    this.port = 3006;
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
      '/getCurrentUser',
      this.authenticateJWT,
      (req: Request, res: Response) => {
        res.send(req.user);
      }
    );
    this.app.post('/createMannschaft', this.createMannschaft.bind(this));
    this.app.put('/addToMannschaft', this.addToMannschaft.bind(this));
    this.app.put('/removeFromMannschaft', this.removeFromMannschaft.bind(this));
    this.app.get('/getMannschaften', this.getMannschaften.bind(this));
    this.app.get(
      '/getMannschaftsMitglieder',
      this.getMannschaftsMitglieder.bind(this)
    );
    this.app.get('/getMannschaft/:mannID', this.getMannschaft.bind(this));
    this.app.delete(
      '/deleteMannschaft/:mannID',
      this.deleteMannschaft.bind(this)
    );
  }

  /**
   * getMannschaften
   * zeige alle Mannschaften aus der Datenbank an
   */
  public async getMannschaften(req: Request, res: Response): Promise<void> {
    const mannschaften = await this.mannschaftRepository.find({
      relations: ['mitglieder'],
    });
    res.json(mannschaften);
  }

  /**
   * getMannschaft
   * zeige eine Mannschaft aus der Datenbank an
   */
  public async getMannschaft(req: Request, res: Response): Promise<void> {
    const mannID = req.params.mannID;
    const mannschaft = await this.mannschaftRepository.findOne(mannID, {
      relations: ['mitglieder'],
    });
    res.json(mannschaft);
  }

  public async addToMannschaft(req: Request, res: Response): Promise<void> {
    if (req.is('json') && req.body) {
      const { mannschaftID, personenIDs } = req.body;
      const mannschaft = await this.mannschaftRepository.findOne(mannschaftID, {
        relations: ['mitglieder'],
      });
      for (const id of personenIDs) {
        const newMitglied = new MannschaftMitglied();
        newMitglied.personenId = id;
        await this.mitgliederRepository.save(newMitglied);
        mannschaft.mitglieder.push(newMitglied);
      }
      await this.mannschaftRepository.save(mannschaft);
      res.json(mannschaft);
    } else {
      res.status(400);
      res.send(
        "wrong format, only json allowed: {'mannschaftID': 2, 'teilnehmerIDs': [1,2,3]}"
      );
    }
  }

  /**
   * removeFromMannschaft
   * entferne Person aus Mannschaft
   */
  public async removeFromMannschaft(req: Request, res: Response): Promise<void> {
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
    } else {
      res.status(400);
      res.send(
        "wrong format, only json allowed"
      );
    }
  }

  public async getMannschaftsMitglieder(
    req: Request,
    res: Response
  ): Promise<void> {
    const mitglieder = await this.mannschaftRepository.find({
      relations: ['mitglieder'],
    });
    res.send(mitglieder);
  }

  /**
   * createMannschaft
   * Erstellt eine neue Mannschaft
   */
  public async createMannschaft(req: Request, res: Response): Promise<void> {
    //TODO: better typechecking?
    if (req.is('json') && req.body) {
      const newMannschaft = new Mannschaft(req.body);
      const createdMannschaft = await this.mannschaftRepository.create(
        newMannschaft
      );
      const savedMannschaft = await this.mannschaftRepository.save(
        createdMannschaft
      );
      const modiefiedMannschaft = await this.mannschaftRepository.findOne(
        savedMannschaft.id,
        {
          relations: ['mitglieder'],
        }
      );
      const personIds = req.body.mitglieder;

      for (const id of personIds) {
        const newMitglied = new MannschaftMitglied();
        newMitglied.personenId = id;
        await this.mitgliederRepository.save(newMitglied);
        modiefiedMannschaft.mitglieder.push(newMitglied);
      }

      await this.mannschaftRepository.save(modiefiedMannschaft);
      res.json(modiefiedMannschaft);
    } else {
      res.status(400);
      res.send('wrong format, only json allowed');
    }
  }

  /**
   * deleteMannschaft
   * Löscht eine Mannschaft aus der DB
   */
  public async deleteMannschaft(req: Request, res: Response): Promise<void> {
    const mannID = req.params.mannID;
    const mannschaft = await this.mannschaftRepository.findOne(mannID);
    if (mannschaft) {
      // sqlite treiber gibt leider keine antwort zurück ...
      await this.mannschaftRepository.delete(mannID);
      res.send(`Mannschaft mit ID "${mannID}" gelöscht`);
    } else {
      res.status(400);
      res.send('Mannschaft nicht gefunden');
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
        }
      );
    } else {
      res.sendStatus(401);
    }
  }
}
