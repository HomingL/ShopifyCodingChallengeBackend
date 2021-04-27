import express, { json, urlencoded } from 'express';
import imageRouter from './image_route';
import authRouter from './auth_route';

const PORT = 5000;

const boot = () => {
  console.log("hello world!");
  const app = express();

  app.use(urlencoded({ extended: false }));
  app.use(json());

  app.use((req, _res, next) => {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
  });

  app.get('/', (_, res) => {
    res.send('hello');
  });

  // app.post('/api/images', (_, res) => {
  //   res.send("create image");
  // });

  app.use("/auth", authRouter);
  app.use('/api/images', imageRouter);

  app.listen(PORT,  () => {
    console.log(`server started on localhost ${PORT}.`)
  })
}

boot();
