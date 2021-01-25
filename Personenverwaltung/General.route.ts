import express, { Request, Response } from "express";

class RouteGeneral {
  constructor(server: express.Express) {
    const router = express.Router();

    router.get("/", (req: Request, res: Response) => {
      res.json({
        message: `Please look at: [url]/api-docs`,
      });
    });

    server.use("/", router);
  }
}

export default RouteGeneral;
