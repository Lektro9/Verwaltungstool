"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controller/controller");
const verwalter = new controller_1.Controller();
verwalter.useMiddleware();
verwalter.createRoutes();
verwalter.startWebserver();
//# sourceMappingURL=App.js.map