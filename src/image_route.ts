import path from 'path';
import express from 'express';
import Datastore from 'nedb-promises';
import Image from './classes/image';
import multer from 'multer';
import fs from 'fs';
import isAuthenticated from './middlewares/isAuth';
import { query, param, check } from 'express-validator';
import { validateInput } from './middlewares/inputValidation';

export default (env = 'dev') => {
  const dbPath = env == 'test'? 'db/test/images.db': 'db/images.db';

  const imageRouter = express.Router();

  const upload = multer({ dest: path.join(__dirname, 'uploads')})

  const imagedb = Datastore.create({ filename: dbPath, autoload: true, timestampData: true})

  // creates a new image
  imageRouter.post('/', isAuthenticated, upload.single('picture'), (req, res) => {
    // if isPublic not provided, it is public by default.
    if (req.body.title === undefined || req.body.isPublic === undefined) return res.status(422).end('title property is not provided');
    imagedb.insert(new Image(req.body.title, req.file, req.username!, req.body.isPublic))
    .then(image => {return res.json(image)})
    .catch(err => res.status(500).end(err));
  })

  // search public images by text
  imageRouter.get('/', [
    query('textField')
    .isString().withMessage('textField must be string type')
    .not().isEmpty().withMessage('textField cannot be empty')
    .trim().escape()
  ], validateInput, async (req, res) => {
    const textField = req.query.textField as string;
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const query = { title:  { $regex: new RegExp(`^${textField}`) }, isPublic: 'true' };
    try {
      const images = await imagedb.find(query).sort({createdAt:-1}).skip(page).limit(limit);
      return res.json(images)
    }catch (err){
      return res.status(500).end(err);
    }
  })

  // get latest images of a user by user id with pagination
  imageRouter.get('/:username', [
    param('username')
    .trim().escape()
  ], async (req, res) => {
    const username = req.params.username;
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    try {
      // if the person requesting is the owner (authorized by session), it may get private photos as well
      const query = (!req.session.username || req.session.username !== username) 
        ? { owner_id: req.params.username, isPublic: true}
        : { owner_id: req.params.username }
      const images = await imagedb.find(query).sort({createdAt:-1}).skip(page).limit(limit);
      console.log('images: ', images);
      return res.json(images);
    }catch (err){
      return res.status(500).end(err);
    }
  })

  // retrive the image file
  imageRouter.get('/:image_id/picture', [
    param('image_id')
    .trim().escape()
  ],isAuthenticated, async (req, res) => {
    const _id = req.params.image_id;
    try {
      const image = await imagedb.findOne({_id}) as Image;
      if (!image) return res.status(404).end(`imageId ${_id} does not exists`);
      if (image.isPublic == 'false' && image.owner_id !== req.session.username) return res.status(403).end("forbidden, you cannot retrieve other users' private image");
      res.setHeader('Content-Type', image.file.mimetype);
      return res.sendFile(image.file.path);
    }catch (err) {
      return res.status(500).end(err);
    }
  });


  imageRouter.delete('/:id/', [
    param('id')
    .trim().escape()
  ],isAuthenticated, async (req, res) => {
    try {
      const found = await imagedb.find({_id: req.params.id});
      const image: any = found[0];
      if (!found) return res.status(404).end('image ' + req.params.id + ' does not exists');
      // Prevent a user deleting images from another user (access control)
      if (image.owner_id !== req.session.username) return res.status(403).end("forbidden, cannot delete other user's image");
      await imagedb.remove({_id: req.params.id}, {});
      fs.unlink(image.file.path, (err) => {
        if (err) return res.status(500).end(err);
      })
      return res.json(image);
    }catch (err){
      return res.status(500).end(err);
    }
  })

  imageRouter.patch('/:id/', [check('status').isIn(['true', 'false']), 
  param('id').trim().escape()],
  isAuthenticated, validateInput, 
  async (req, res) => {
    const status: boolean = req.body.status;
    if (status === undefined) return res.status(400).end('isPublic property is not provided');
    try{
      const image = await imagedb.findOne({_id: req.params.id}) as Image;
      if (!image) return res.status(404).end("Image id " + req.params.id + " does not exists");
      // only the owner of the image has the permission 
      if (image.owner_id !== req.session.username) return res.status(403).end("forbidden, cannot change other users photo permission");
      image.isPublic = status
      await imagedb.update({_id: req.params.id}, { $set: { isPublic: status} }, {multi: false});
      const updated_image = await imagedb.findOne({_id: req.params.id}) as Image;
      res.json(updated_image);
    }catch (err){
      return res.status(500).end(err);
    }
  })

  return imageRouter;
}
