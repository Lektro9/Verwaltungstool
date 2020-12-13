interface user {
  username: string;
  password: string;
  role: string;
}
export {};
declare global {
  namespace Express {
    interface Request {
        ...
      user: user;
    }
  }
}
