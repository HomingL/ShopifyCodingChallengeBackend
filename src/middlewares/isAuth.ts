// import { NextFunction } from 'express';
// @ts-ignore
import session from 'express-session';

const isAuthenticated = (req: Express.Request, res: any, next: any) => {
  if (!req.session.username) return res.status(401).end("access denied, please sign in!");
  return next();
};

declare module 'express-session' {
  export interface SessionData {
    username: string;
  }
}

export default isAuthenticated;