import express from 'express';
import Datastore from 'nedb-promises';
import crypto from 'crypto';

const userdb = Datastore.create({ filename: 'db/users.db', autoload: true })
const authRouter = express.Router();


authRouter.post("/signup/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try{
    const found = await userdb.findOne({_id: username});
    if (found) return res.status(409).end(`image ${username} already exists`);
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const saltedHash = hash.digest('base64');
    userdb.update({_id: username},{_id: username, saltedHash, salt}, {upsert: true});
    return res.json("user " + username + " signed up");
  }catch(err){
    return res.status(500).end(err);
  }
});


// authRouter.post("/signin/", async (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   // user_service.findUser(username, password, (err, user, code) => {
//   //     if (err) return res.status(code).end(err);
//   //     /* store username in session and cookie */
//   //     req.session.username = username;
//   //     res.setHeader('Set-Cookie', cookie.serialize('username', username, {
//   //           path : '/', 
//   //           maxAge: 60 * 60 * 24 * 7
//   //     }));
//   //     return res.json("user " + username + " signed in");
//   // });
//   try {
//     const user = await userdb.findOne({ _id: username });
//     if (!user) return res.status(401).end('access denied, incorrect username or password');
    
//   }catch(err){
//     return
//   }

// });


// authRouter.get('/signout/', isAuthenticated, function(req, res, next){
//   req.session.destroy();
//   res.setHeader('Set-Cookie', cookie.serialize('username', '', {
//         path : '/', 
//         maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
//   }));
//   res.json('user signed out');
// });


export default authRouter;