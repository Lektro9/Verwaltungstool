import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import controller from './controller/controller';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

const app = express();
const port = 3005;
const AccessTokenExpiryTime = '15m';

const Controller: controller = new controller();
Controller.createUsers();

const infoLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`A ${req.method}-request was made by ${req.ip}`);
    next();
};

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use(infoLogger);

app.use(cookieParser());

app.get(
    '/getData',
    Controller.authenticateJWT,
    (req: Request, res: Response) => {
        res.send(req.user);
    },
);

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
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: AccessTokenExpiryTime },
        );

        const refreshToken = jwt.sign(
            { username: user.username, role: user.role },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: '24h' },
        );
        res.cookie('jwt', refreshToken, { httpOnly: true });
        res.json({ accessToken });
    } else {
        res.send('Username or password incorrect');
    }
});

app.post('/token', (req: Request, res: Response) => {
    //TODO: send new AT
    const refreshToken = req.cookies.jwt;
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        (err: any, user: any) => {
            if (err) {
                return res.sendStatus(403);
            }
            const accessToken = jwt.sign(
                { username: user.username, role: user.role },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: AccessTokenExpiryTime },
            );
            res.send({ accessToken });
        },
    );
});

app.listen(port, () => {
    console.log(`Server Started at Port, ${port}`);
});
