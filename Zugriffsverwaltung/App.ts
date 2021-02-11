import { Controller } from "./controller/controller";



const verwalter = new Controller();
verwalter.useMiddleware();
verwalter.createRoutes();
verwalter.startWebserver();
