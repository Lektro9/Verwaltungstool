"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = require("../model/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Controller {
    constructor() {
        this.createDBConnection()
            .then((connection) => {
            this.connection = connection;
            this.userRepository = this.connection.getRepository(user_1.User);
        })
            .catch((e) => console.log(e));
        this.app = express_1.default();
        this.port = 3005;
        this.AccessTokenExpiryTime = '15m';
        this.RefreshTokenExpiryTime = '24h';
    }
    /**
     * Erstelle eine Verbindung mit der Datenbank
     */
    async createDBConnection() {
        const connection = await typeorm_1.createConnection();
        return connection;
    }
    /**
     * useMiddleware
     * Funktionen die vor jeder Route ausgeführt werden soll
     */
    useMiddleware() {
        //zum Versenden von Cookies
        this.app.use(cookie_parser_1.default());
        //zum Loggen sämtlicher Zugriffe
        const infoLogger = (req, res, next) => {
            console.log(`A ${req.method}-request was made by ${req.ip}`);
            next();
        };
        this.app.use(infoLogger);
        //erlaubt Webserver jsons zu empfangen
        this.app.use(express_1.default.json());
        //setzt CORS Header 'Access-Control-Allow-Origin' und welche REST-Methoden von wem genutzt werden dürfen
        //hier: alle dürfen alles
        this.app.use(cors_1.default({ credentials: true, origin: 'http://localhost:3000' }));
        //statische html-Dateien im Ordner freigeben
        this.app.use(express_1.default.static('buildFrontend', { etag: false }));
    }
    /**
     * createRoutes
     *
     * Definiert Routen, Methoden und deren zugehörige Funktionen
     *
     * bind() wird benötigt wenn Eigenschaften aus dieser Klasse verwendet werden
     * müssen
     */
    createRoutes() {
        // testen ob JWT korrekt überprüft wird
        // und Beispiel zum Auslesen der Daten aus JWTs
        this.app.get('/getData', this.authenticateJWT, (req, res) => {
            res.send(req.user);
        });
        this.app.get('/token', this.generateNewAccessToken.bind(this));
        this.app.post('/login', this.login.bind(this));
        this.app.get('/logout', this.logout.bind(this));
        this.app.get('/users', [this.authenticateJWT, this.isUserAdmin], this.getAllUsers.bind(this));
        this.app.post('/user', [this.authenticateJWT, this.isUserAdmin], this.createUser.bind(this));
        this.app.delete('/user/:personID', [this.authenticateJWT, this.isUserAdmin], this.deleteUser.bind(this));
    }
    /**
     * generateNewAccessToken
     * neuer Refreshtoken gibt neuen Accesstoken
     */
    generateNewAccessToken(req, res) {
        const refreshToken = req.cookies.jwt;
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            const accessToken = jsonwebtoken_1.default.sign({ username: user.username, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: this.AccessTokenExpiryTime });
            res.send({ accessToken });
        });
    }
    /**
     * login
     * Nutzer wird eingeloggt und bekommt tokens
     */
    async login(req, res) {
        const { login, password } = req.body;
        // Filter user from the users array by username and password
        const user = await this.userRepository.findOne({
            where: { login: login },
        });
        if (user && user.password === password) {
            // Generate an access token
            const accessToken = jsonwebtoken_1.default.sign({ username: user.login, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: this.AccessTokenExpiryTime });
            // Generate a refresh token
            const refreshToken = jsonwebtoken_1.default.sign({ username: user.login, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: this.RefreshTokenExpiryTime });
            res.cookie('jwt', refreshToken, { httpOnly: true });
            res.json({ accessToken });
        }
        else {
            res.status(401);
            res.send({ error: 'Username or password incorrect' });
        }
    }
    /**
     * logout
     */
    async logout(req, res) {
        res.cookie('jwt', '', { httpOnly: true });
        res.send('logged out.');
    }
    /**
     * showAllUsers
     * zeige alle Nutzer aus der Datenbank an
     */
    async getAllUsers(req, res) {
        const users = await this.getAllPersonsFromDB();
        res.json(users);
    }
    async getAllPersonsFromDB() {
        const users = await this.userRepository.find();
        return users;
    }
    /**
     * createUser
     * Erstellt eine neue Person
     */
    async createUser(req, res) {
        if (req.is('json') && req.body) {
            const newUser = new user_1.User(req.body);
            let IsUserAlreadyExisting = await this.userRepository.find({
                where: [
                    { login: newUser.login },
                ]
            });
            if (IsUserAlreadyExisting.length > 0) {
                res.status(403);
                res.send(`User with the login '${newUser.login}' already in use.`);
            }
            else {
                let createNewUser = await this.userRepository.create(newUser);
                await this.userRepository.save(createNewUser);
                delete createNewUser.password;
                res.json(createNewUser);
            }
        }
        else {
            res.status(400);
            res.send("wrong format, only json allowed: {'firstName': 'string', 'lastName': 'string', 'age': number}");
        }
    }
    /**
     * deleteUser
     * Löscht einen Nutzer aus der DB
     */
    async deleteUser(req, res) {
        const personID = req.params.personID;
        const deleteResult = await this.userRepository.delete(personID);
        if (deleteResult.affected) {
            res.send(`Person mit ID "${personID}" gelöscht`);
        }
        else {
            res.status(400);
            res.send('Person nicht gefunden');
        }
    }
    /**
     * startWebserver
     * startet den Webserver
     */
    startWebserver() {
        this.app.listen(this.port, () => {
            console.log(`Server startet unter: http://localhost:${this.port}`);
        });
    }
    /**
     * authenticateJWT
     * prüft JWT auf Gültigkeit
     */
    authenticateJWT(req, res, next) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }
                req.user = user;
                next();
            });
        }
        else {
            res.sendStatus(401);
        }
    }
    /**
    * isUserAdmin
    * prüft ob nutzer aus dem validen Token nötige Rechte besitzt
    */
    isUserAdmin(req, res, next) {
        console.log(req.user);
        if (req.user.role) {
            next();
        }
        else {
            res.sendStatus(401);
        }
    }
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map