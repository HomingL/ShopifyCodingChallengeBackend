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
    - (string) "username ${your_username} signed up"
- response: 409
    - (string) "username ${your_username} already exists"
- response: 500
    - (string) error message
``` 
$ curl -H "Content-Type: application/json" \
        -X POST -d '{"username":"alice","password":"alice"}' \
        -c cookie.txt localhost:3000/auth/signup/
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
    -d '{"username":"alice","password":"alice"}' \
    -c cookie.txt localhost:3000/auth/signin/
```


### Sign out
- description: Sign in to a user account
- request: `GET /auth/signout/`
    - content-type: `application/json`
    - body: object
        - username: (string) the username of the user
        - password: (string) the password of the user
- resposne: 200
    - (string) "user signed out"
- response: 401
    - (string) "access denied"
- response: 500
    - (string) error message

```
curl -b cookie.txt -c cookie.txt localhost:3000/auth/signout/
```

## Image API

### Create 
- description: create a new image
- request: `POST /api/images/`
    - content-type: `application/json`
    - body: object
        - title: (string) the tile of the image
        - author: (string) the author of the image
        - url: (string) the url of the image

- response: 200
    - content-type `applicaiton/json`
    - body: object
        - _id: (string) the image id
        - title: (string) the title of the image
        - author: (string) the author of the image
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
        -F  author=author-name \
        -F  title=title-name \
        -F  picture=@~/picture.jpeg \
        http://localhost:3000/api/images/
```

### Read

- description: retrieve the latest image
- request: `GET /api/images/[?page=0]`   
- response: 200
    - content-type: `application/json`
    - body: list of objects
      - _id: (string) the image id
      - author: (string) the authors username
      - file: (object) the file object
      - createdAt: (string) the created date
      - updatedAt: (string) the last updated date
    OR
    when there is no image.
    - body: empty string
- response: 401
    - body: (string) access denied
- response: 500
    - body: (string) error message
 
``` 
$ curl -X GET 'http://localhost:3000/api/images/?page=0&limited=5'
``` 

### Read Picture

- description: retrieve the picture of the image
- request: `GET /api/images/:image/profile/picture/`   
- response: 200
    - content-type: `application/json`
    - body: file
- response: 401
    - body: (string) access denied
- response: 500
    - body: (string) error message
 
``` 
$ curl -X GET 'http://localhost:3000/api/images/your-image-id/profile/picture/'
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
$ curl -X DELETE 'http://localhost:3000/api/images/N92vn2mFlJeRr89s'
``` 

## comment API

### Create

- description: create a new comment
- request: `POST /api/comments/`
    - content-type: `application/json`
    - body: object
      - imageId: (string) the imageId of the comment
      - content: (string) the content of the comment
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the comment id
      - imageId: (string) the imageId of the comment
      - content: (string) the content of the comment
      - createdAt: (string) the date of the comment
      - updatedAt: (string) the update date of the comment
- response: 401
    - body: (string) access denied
- response: 500
    - body: (string) error message

``` 
$ curl -X POST 
       -H "Content-Type: `application/json`" 
       -d '{"content":"hello world","author":"me", "imageId": "1sdaf"} 
       http://localhost:3000/api/comments/'
```

### Read

- description: retrieve the last 10 comments 
- request: `GET /api/comments/[?page=0&limited=10]`   
- response: 200
    - content-type: `application/json`
    - body: list of objects
      - _id: (string) the comment id
      - imageId: (string) the imageId of the comment
      - content: (string) the content of the comment
      - createdAt: (string) the date of the comment
      - updatedAt: (string) the update date of the comment
- response: 401
    - body: (string) access denied
- response: 500
    - body: (string) error message
 
``` 
$ curl  -X GET
        -H "Content-Type: `application/json`" 
        http://localhost:3000/api/comments/[?page&limit=10]
``` 
  
### Delete
  
- description: delete the comment id
- request: `DELETE /api/comments/:id/`
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the comment id
      - content: (string) the content of the comment
      - imageId: (string) the imageId of the comment
      - createdAt: (string) the date of the comment
      - updatedAt: (string) the update date of the comment
- response: 401
    - body: (string) access denied
- response: 403
    - body: (string) forbidden
- response: 404
    - body: comment :id does not exists
- response: 500
    - body: (string) error message

``` 
$ curl -X DELETE
       http://localhost:3000/api/comments/jed5672jd90xg4awo789/
``` 


