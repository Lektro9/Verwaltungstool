import { NextFunction, Request, Response } from "express";
import user from "../model/user";
import jwt from 'jsonwebtoken';


class controller {
    users: user[]

    constructor() {
        this.users = this.createUsers();
    }

    public createUsers(): user[] {
        this.users = [
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
        return this.users
    }

    public authenticateJWT(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
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
}

export default controller;