import express, { Application, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { User } from '../model/user';
import jwt from 'jsonwebtoken';

import 'reflect-metadata';
import { createConnection, Repository, Connection } from 'typeorm';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

export class Controller {
    app: Application;
    userRepository: Repository<User>;
    connection: Connection;
    port: number;
    AccessTokenExpiryTime: string;
    RefreshTokenExpiryTime: string;

    constructor() {
        this.createDBConnection()
            .then((connection) => {
                this.connection = connection;
                this.userRepository = this.connection.getRepository(User);
            })
            .catch((e) => console.log(e));
        this.app = express();
        this.port = 3005;
        this.AccessTokenExpiryTime = '15m';
        this.RefreshTokenExpiryTime = '24h';
    }

    /**
     * Erstelle eine Verbindung mit der Datenbank
     */
    public async createDBConnection(): Promise<Connection> {
        const connection = await createConnection();
        return connection;
    }

    /**
     * useMiddleware
     * Funktionen die vor jeder Route ausgeführt werden soll
     */
    public useMiddleware(): void {
        //zum Versenden von Cookies
        this.app.use(cookieParser());
        //zum Loggen sämtlicher Zugriffe
        const infoLogger = (
            req: Request,
            res: Response,
            next: NextFunction,
        ) => {
            console.log(`A ${req.method}-request was made by ${req.ip}`);
            next();
        };
        this.app.use(infoLogger);
        //erlaubt Webserver jsons zu empfangen
        this.app.use(express.json());
        //setzt CORS Header 'Access-Control-Allow-Origin' und welche REST-Methoden von wem genutzt werden dürfen
        //hier: alle dürfen alles
        this.app.use(
            cors({ credentials: true, origin: 'http://localhost:3000' }),
        );
        //statische html-Dateien im Ordner freigeben
        this.app.use(express.static('buildFrontend', { etag: false }));
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
            '/getData',
            this.authenticateJWT,
            (req: Request, res: Response) => {
                res.send(req.user);
            },
        );
        this.app.get('/token', this.generateNewAccessToken.bind(this));

        this.app.post('/login', this.login.bind(this));
        this.app.get('/logout', this.logout.bind(this));
        this.app.get('/users', this.getAllUsers.bind(this));
        this.app.post('/user', this.createUser.bind(this));
        this.app.delete('/user/:personID', this.deleteUser.bind(this));
    }

    /**
     * generateNewAccessToken
     * neuer Refreshtoken gibt neuen Accesstoken
     */
    public generateNewAccessToken(req: Request, res: Response): void {
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
                    { expiresIn: this.AccessTokenExpiryTime },
                );
                res.send({ accessToken });
            },
        );
    }

    /**
     * login
     * Nutzer wird eingeloggt und bekommt tokens
     */
    public async login(req: Request, res: Response): Promise<void> {
        const { login, password } = req.body;

        // Filter user from the users array by username and password
        const user = await this.userRepository.findOne({
            where: { login: login },
        });

        if (user && user.password === password) {
            // Generate an access token
            const accessToken = jwt.sign(
                { username: user.login, role: user.role },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: this.AccessTokenExpiryTime },
            );
            // Generate a refresh token
            const refreshToken = jwt.sign(
                { username: user.login, role: user.role },
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: this.RefreshTokenExpiryTime },
            );
            res.cookie('jwt', refreshToken, { httpOnly: true });
            res.json({ accessToken });
        } else {
            res.status(401);
            res.send({ error: 'Username or password incorrect' });
        }
    }

    /**
     * logout
     */
    public async logout(req: Request, res: Response): Promise<void> {
        res.cookie('jwt', '', { httpOnly: true });
        res.send('logged out.');
    }

    /**
     * showAllUsers
     * zeige alle Nutzer aus der Datenbank an
     */
    public async getAllUsers(req: Request, res: Response): Promise<void> {
        const users = await this.getAllPersonsFromDB();
        res.json(users);
    }

    private async getAllPersonsFromDB(): Promise<User[]> {
        const users = await this.userRepository.find();
        return users;
    }

    /**
     * createUser
     * Erstellt eine neue Person
     */
    public async createUser(req: Request, res: Response): Promise<void> {
        if (req.is('json') && req.body) {
            const newUser = new User(req.body);
            let IsUserAlreadyExisting = await this.userRepository.find({
                where: [
                    { login: newUser.login },
                ]
            });
            if (IsUserAlreadyExisting.length > 0) {
                res.send(`User with the login '${newUser.login}' already in use.`)
            } else {
                const createNewUser = await this.userRepository.create(newUser);
                await this.userRepository.save(createNewUser);
                res.json(createNewUser);
            }
        } else {
            res.status(400);
            res.send(
                "wrong format, only json allowed: {'firstName': 'string', 'lastName': 'string', 'age': number}",
            );
        }
    }

    /**
     * deleteUser
     * Löscht einen Nutzer aus der DB
     */
    public async deleteUser(req: Request, res: Response): Promise<void> {
        const personID = req.params.personID;
        const deleteResult = await this.userRepository.delete(personID);
        if (deleteResult.affected) {
            res.send(`Person mit ID "${personID}" gelöscht`);
        } else {
            res.status(400);
            res.send('Person nicht gefunden');
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
        next: NextFunction,
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
                },
            );
        } else {
            res.sendStatus(401);
        }
    }
}
