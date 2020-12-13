import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface user {
  username: string;
  password: string;
  role: string;
}

const app = express();
const port = 3005;
const AccTokenSecret: any = process.env.ACCESS_TOKEN_SECRET;

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, AccTokenSecret, (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const infoLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`A ${req.method}-request was made by ${req.ip}`);
  next();
};

app.use(express.json({ limit: '1mb' }));

app.use(infoLogger);

const classifiedData = [
  {
    data: 'this is only shown to logged in users',
  },
];

const users: user[] = [
  {
    username: 'john',
    password: 'pw123',
    role: 'admin',
  },
  {
    username: 'james',
    password: 'pw123',
    role: 'member',
  },
];

app.get('/getData', authenticateJWT, (req: Request, res: Response) => {
  res.send(classifiedData);
});

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Filter user from the users array by username and password
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (user) {
    // Generate an access token
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      AccTokenSecret
    );

    res.json({ accessToken });
  } else {
    res.send('Username or password incorrect');
  }
});

app.listen(port, () => {
  console.log(`Server Started at Port, ${port}`);
});
