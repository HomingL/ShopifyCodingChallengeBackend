# Image Repo

## App Description

Like the name of the project, this applicaiton provides a platform for users to store their images to the repository and browse their user's public images.  

### Running Applicaiton locally

Using npm 
```bash
$ npm install
$ npm run watch
$ npm run dev
```

OR

Using docker to pull the latest image of the application
```bash
docker-compose up
```

Backend endpoint is at localhost:5000

## Testing
Testing is done on every commits with github Action
```bash
$ npm install
$ npm run test
```

## API Documentation

Under [doc/API_doc.md](https://github.com/HomingL/ShopifyCodingChallengeBackend/blob/main/doc/API_doc.md)


## Technologies Used
- [Express](https://expressjs.com/)
- [NeDB](https://github.com/louischatriot/nedb) (light weight version of MongoDB)
- [Jest](https://jestjs.io/) (testing)


## Features Implemented

- User Input Validation

- Authentication
  - sign up
  - sign in
  - sign out

- SEARCH function
  - by title of image
  - by image id
  - by users

- ADD image
  - one image at a time
  - private or public (permission)
  - secure uploading and stored images

- DELETE image
  - ne image at a time
  - prevent a user deleting images from another user (access control)
  - secure deletion
