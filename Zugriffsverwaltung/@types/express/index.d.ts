import user from '../../model/user'

declare module 'express' {
    export interface Request {
        user?: user;
    }
}