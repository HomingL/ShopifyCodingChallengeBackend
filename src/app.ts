import express, { json, urlencoded } from 'express';
import imageRouter from './image_route';
import authRouter from './auth_route';
import session from 'express-session';
import cookie from 'cookie';

const PORT = 5000;

const boot = () => {

  console.log("hello world!");
  const app = express();

  app.use(urlencoded({ extended: false }));
  app.use(json());

  app.use(session({
    secret: 'ShopifyCodingChallenge!',
    resave: false,
    saveUninitialized: true,
  }));

  app.use((req, _res, next) => {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
  });

  app.get('/', (_, res) => {
    res.send('hello');
  });

  app.use((req: express.Request, res, next) => {
    req.username = (req.session.username)? req.session.username : '';
    res.setHeader('Set-Cookie', cookie.serialize('username', req.username || '', {
        path : '/', 
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
  }));
    console.log("HTTP request", req.username, req.method, req.url, req.body);
    next();
  });

  app.use("/auth", authRouter);
  app.use('/api/images', imageRouter);

  app.listen(PORT,  () => {
    console.log(`server started on localhost ${PORT}.`)
  })
}

declare module 'express-session' {
  export interface SessionData {
    username: string;
  }
}

boot();
