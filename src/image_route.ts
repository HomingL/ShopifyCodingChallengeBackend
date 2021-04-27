import path from 'path';
import express from 'express';
import Datastore from 'nedb-promises';
import Image from './classes/image';
import multer from 'multer';
import fs from 'fs';

const imageRouter = express.Router();

const upload = multer({ dest: path.join(__dirname, 'uploads')})

const imagedb = Datastore.create({ filename: 'db/images.db', autoload: true})
// const imagedb = new Datastore({ filename: 'db/users.db', autoload: true});

imageRouter.get('/', (_, res) => {
  res.send('image Router !');
})

imageRouter.post('/', upload.single('picture'), function (req, res){
  imagedb.insert(new Image(req.body.title, req.file))
  .then(image => {return res.json(image)})
  .catch(err => res.status(500).end(err));
})

imageRouter.delete('/:id/', async (req, res) => {
  try {
    const found = await imagedb.find({_id: req.params.id});
    const image: any = found[0];
    console.log('found!');
    if (!found) return res.status(404).end('image ' + req.params.id + ' does not exists');
    await imagedb.remove({_id: req.params.id}, {});
    fs.unlink(image.file.path, (err) => {
      if (err) return res.status(500).end(err);
    })
    return res.json(image);
  }catch(err){
    return res.status(500).end(err);
  }
})

export default imageRouter;