import express, { NextFunction, Request, Response } from "express";
import RouteGeneral from "./General.route";
import RoutePerson from "./person/Person.route";
import swaggerUi from "swagger-ui-express";
import Yaml from "yamljs";
import cors from 'cors'
import "reflect-metadata";

const swaggerDocument = Yaml.load("./config/swagger.yaml");
class App {
  private httpServer: any;

  constructor() {
    this.httpServer = express();
    this.httpServer.use(cors());
    this.httpServer.use(express.json());
    this.httpServer.use(express.urlencoded({ extended: false }));

    new RouteGeneral(this.httpServer);
    new RoutePerson(this.httpServer);

    this.httpServer.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }

  public StartServer = (port: number) => {
    return new Promise((resolve, reject) => {
      this.httpServer
        .listen(port, () => {
          resolve(port);
        })
        .on("error", (err: object) => reject(err));
    });
  };
}

export default App;
