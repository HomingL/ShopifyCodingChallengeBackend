import express from 'express';
import Datastore from 'nedb-promises';
import crypto from 'crypto';
import cookie from 'cookie';
import isAuthenticated from './middlewares/isAuth';
import User from './classes/user';



export default (env = 'dev') => {
  const dbPath = env == 'test'? 'db/test/users.db': 'db/users.db';

  const userdb = Datastore.create({ filename: dbPath, autoload: true })
  const authRouter = express.Router();


  authRouter.post("/signup/", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try{
      const found = await userdb.findOne({_id: username});
      if (found) return res.status(409).end(`user ${username} already exists`);

      // store password as salted hash
      const salt = crypto.randomBytes(16).toString('base64');
      const hash = crypto.createHmac('sha512', salt);
      hash.update(password);
      const saltedHash = hash.digest('base64');
      userdb.insert(new User(username, salt, saltedHash));
      return res.json(`user ${username} signed up`);
    }catch(err){
      return res.status(500).end(err);
    }
  });


  authRouter.post("/signin/", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
      const user: any = await userdb.findOne({ _id: username });
      if (!user) return res.status(401).end('access denied, username does not exist');
      // verify password with salted hash
      const salt = user.salt;
      const saltedHashStored = user.saltedHash;
      const saltedHash = crypto.createHmac('sha512', salt).update(password).digest('base64');
      if (saltedHash !== saltedHashStored) return res.status(401).end('access denied, incorrect username or password');
      console.log('session:', req.session);
      (req.session as any).username = username;
      res.setHeader('Set-Cookie', cookie.serialize('username', username, {
            path : '/', 
            maxAge: 60 * 60 * 24 * 7
      }));
      return res.json(`user ${username} signed in`);
    }catch(err){
      return res.status(500).end(err);
    } 
  });


  authRouter.get('/signout/', isAuthenticated, function(req, res){
    req.session.destroy(()=>{
      console.log(`user session destroyed`);
    });
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    res.json('user signed out');
  });

  return authRouter;
}
