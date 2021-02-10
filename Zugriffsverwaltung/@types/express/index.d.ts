import { User } from '../../model/user'

declare module 'express' {
    export interface Request {
        user?: User;
    }
}