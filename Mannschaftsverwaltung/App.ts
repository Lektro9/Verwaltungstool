import { Controller } from "./controller/Controller";

const verwalter = new Controller();
verwalter.useMiddleware();
verwalter.createRoutes();
verwalter.startWebserver();
