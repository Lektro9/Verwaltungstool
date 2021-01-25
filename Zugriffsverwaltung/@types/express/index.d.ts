import { User } from '../../model/User'

declare module 'express' {
    export interface Request {
        user?: User;
    }
}