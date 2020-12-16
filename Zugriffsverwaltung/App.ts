import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import user from './model/user'
import controller from "./controller/controller";
dotenv.config();



const app = express();
const port = 3005;


const Controller: controller = new controller();
Controller.createUsers();

const infoLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`A ${req.method}-request was made by ${req.ip}`);
  next();
};

app.use(express.json({ limit: '1mb' }));

app.use(infoLogger);

app.get('/getData', Controller.authenticateJWT, (req: Request, res: Response) => {
  res.send(req.user);
});

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Filter user from the users array by username and password
  const user = Controller.users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (user) {
    // Generate an access token
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      Controller.AccTokenSecret
    );

    res.json({ accessToken });
  } else {
    res.send('Username or password incorrect');
  }
});

app.listen(port, () => {
  console.log(`Server Started at Port, ${port}`);
});
