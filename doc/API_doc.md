# Image Repo REST API Documentation

## Authentication API

### Sign UP
- description: create a new user
- request: `POST /auth/signup/`
    - content-type: `application/json`
    - body: object
        - username: (string) the username of the user
        - password: (string) the password of the user
- resposne: 200
    - (string) "user ${your_username} signed up"
- response: 409
    - (string) "username ${your_username} already exists"
- response: 500
    - (string) error message
``` 
$ curl -H "Content-Type: application/json" \
        -X POST -d '{"username":"user","password":"user"}' \
        -c cookie.txt localhost:5000/auth/signup/
```


### Sign In
- description: Sign in to a user account
- request: `POST /auth/signin/`
    - content-type: `application/json`
    - body: object
        - username: (string) the username of the user
        - password: (string) the password of the user
- resposne: 200
    - (string) "username ${your_username} signed in"
- response: 401
    - (string) "access denied"
- response: 500
    - (string) error message
```
curl -H "Content-Type: application/json" \
    -X POST \
    -d '{"username":"user","password":"user"}' \
    -c cookie.txt localhost:5000/auth/signin/
```


### Sign out
- description: Sign in to a user account
- request: `GET /auth/signout/`
- resposne: 200
    - (string) "user signed out"
- response: 401
    - (string) "access denied"
- response: 500
    - (string) error message

```
$ curl -b cookie.txt -c cookie.txt localhost:5000/auth/signout/
```

## Image API

### Create 
- description: create a new image
- request: `POST /api/images/`
    - content-type: `multipart/form-data`
    - body: object
        - title: (string) the title of the image
        - picture: (File) the image
- response: 200
    - content-type `applicaiton/json`
    - body: list of image objects
        - _id: (string) the image id
        - title: (string) the title of the image
        - owner_id: (string) owner of the image
        - file: (object) the file object
        - createdAt: (string) the created date
        - updatedAt: (string) the last updated date
- response: 401
    - body: (string) access denied
- response: 500
    - body: (string) error message

``` 

$ curl -X POST  \
        -H "Content-Type: multipart/form-data" \
        -F  title=title-name \
        -F  picture=@./picture.jpeg \
        http://localhost:5000/api/images/
```

### Search 

- description: search public images by text
- request: `GET /api/images[?textField=your_search&page=0&limit=5]`   
- response: 200
    - content-type: `application/json`
    - body: list of image objects
        - _id: (string) the image id
        - title: (string) the title of the image
        - owner_id: (string) owner of the image
        - file: (object) the file object
        - isPublic: (boolean) the permssion of the image
        - createdAt: (string) the created date
        - updatedAt: (string) the last updated date
- response: 401
    - body: (string) access denied
- response: 500
    - body: (string) error message
 
``` 
$ curl -b cookie.txt -X GET localhost:5000/api/images?textField=your_search&page=0&limit=5

``` 

### Read

- description: retrieve the latest image of a user
- request: `GET /api/images/:username/[?page=0&limit=5]`   
- response: 200
    - content-type: `application/json`
    - body: list of image ojects
        - _id: (string) the image id
        - title: (string) the title of the image
        - owner_id: (string) owner of the image
        - file: (object) the file object
        - isPublic: (boolean) the permssion of the image
        - createdAt: (string) the created date
        - updatedAt: (string) the last updated date
- response: 401
    - body: (string) access denied
- response: 500
    - body: (string) error message
 
``` 
$ curl -b cookie.txt -X GET localhost:5000/api/images/user?page=0&limit=5

``` 

### Read Picture

- description: retrieve the picture of the image
- request: `GET /api/images/:image/picture/`   
- response: 200
    - content-type: `image/png`
    - body: file
- response: 401
    - body: (string) access denied
- response: 404
    - body: (string) imageId does not exist
- response: 500
    - body: (string) error message
 
``` 
$ curl -b cookie.txt -X GET 'http://localhost:5000/api/images/your-image-id/profile/picture/'
``` 

### Delete
  
- description: delete the image id
- request: `DELETE /api/images/:id/`
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the image id
      - author: (string) the authors username
      - file: (object) the file object
      - isPublic: (boolean) the permssion of the image
      - createdAt: (string) the created date
      - updatedAt: (string) the last updated date
- response: 401
    - body: (string) access denied
- response: 403
    - body: (string) forbidden
- response: 404
    - body: image :id does not exists
- response: 500
    - body: (string) error message

``` 
$ curl -b cookie.txt -X DELETE http://localhost:5000/api/images/your-image-id

``` 

### Update Permission

- description: update the permission of the image
- request: `PATCH /api/images/:image/profile/picture/`
    - content-type: `application/json`
    - body: object
      - status: (boolean) the permission of the image. True for public, false for private
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the image id
      - author: (string) the authors username
      - file: (object) the file object
      - isPublic: (boolean) the permssion of the image
      - createdAt: (string) the created date
      - updatedAt: (string) the last updated date
- response: 401
    - body: (string) access denied
- response: 500
    - body: (string) error message
 
``` 
$ curl -b cookie.txt -H "Content-Type: application/json" -X PATCH -d '{"status":false}' localhost:5000/api/images/nMeLiVD2LOjLHiTg/
``` 
