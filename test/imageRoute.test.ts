import boot from '../src/app';
import request from 'supertest';
import fs from 'fs';

const app = boot('test');
const memo = {};

describe('POST /api/images/', () => {

  test('create image without authentication', async () => {

    const bodies = [
      {title: 'title1', isPublic: true },
      {title: 'title2', isPublic: true },
      {title: 'title3', isPublic: true },
    ]
    for (const body of bodies){
      const response = await request(app).post("/api/images").send(body);
      expect(response.status).toBe(401);
    }
  })

  test('create image with Authentication', async () => {

    
    const auth = {
      username: 'test-username',
      password: 'test-password',
    }

    await request(app).post("/auth/signup").send(auth);
    const signin = await request(app).post("/auth/signin").send(auth);
    const cookie = signin.headers['set-cookie'];


    const fields = [
      {title: 'title1', isPublic: 'true'},
      {title: 'title2', isPublic: 'false'},
      {title: 'title3', isPublic: 'true'},
  ];
  for (const field of fields){
    const response = await request(app).post("/api/images").set('Cookie', cookie).field(field).attach('picture', `${__dirname}/test-image.png`);
    expect(response.status).toBe(200);
    const responseBody = JSON.parse(response.text);
    expect(responseBody.title).toBe(field.title); // check if title matches
    expect(responseBody.isPublic).toBe(field.isPublic); // check if permission of image matches
    expect(fs.existsSync(responseBody.file.path)).toBe(true); // checks if the images has been uploaded
    expect(responseBody.owner_id).toBe(auth.username); // the owner of the image matches the user signed in
    memo[field.title] = responseBody; // save the id of the image for future tests
  }
  })
})

describe('PATCH /api/images/:id', () => {

  test('change permission of an image without Authentication', async () => {

    for (const title in memo){
      const image = memo[title];
      const image_id = image._id;
      const original_status = image.isPublic;
      const response = await request(app).patch(`/api/images/${image_id}`).send({status: !original_status});
      expect(response.status).toBe(401); // retrieve image only for authenticated users
    }
  })

  test('change permission of an image', async () => {
    const auth = {
      username: 'test-username',
      password: 'test-password',
    }

    await request(app).post("/auth/signup").send(auth);
    const signin = await request(app).post("/auth/signin").send(auth);
    const cookie = signin.headers['set-cookie'];

    for (const title in memo){
      const image = memo[title];
      const image_id = image._id;
      const original_status = image.isPublic;
      const response = await request(app).patch(`/api/images/${image_id}`).set('Cookie', cookie).send({status: !original_status});
      const responseBody = JSON.parse(response.text);
      expect(responseBody.isPublic).toBe(!original_status);
    }
  })

  test('change the permission of other users image', async () => {
    
    const auth = {
      username: 'test-username2',
      password: 'test-password2',
    }

    await request(app).post("/auth/signup").send(auth);
    const signin = await request(app).post("/auth/signin").send(auth);
    const cookie = signin.headers['set-cookie'];

    for (const title in memo){
      const image = memo[title];
      const image_id = image._id;
      const original_status = image.isPublic;
      const response = await request(app).patch(`/api/images/${image_id}`).set('Cookie', cookie).send({status: !original_status});
      expect(response.status).toBe(403); // not allowed to delete other user's image
    }
  })
})

// retrieve the image file
describe('GET /api/images/:image_id/picture', () => {

  test('non-existent image', async () => {
    const auth = {
      username: 'test-username',
      password: 'test-password',
    }

    await request(app).post("/auth/signup").send(auth);
    const signin = await request(app).post("/auth/signin").send(auth);
    const cookie = signin.headers['set-cookie'];



    const response = await request(app).get('/api/images/0/picture').set('Cookie', cookie).send();
    // const responseBody = JSON.parse(response.text);
    expect(response.status).toBe(404);
    
  })

  test('retrieve users own image', async () => {
    const auth = {
      username: 'test-username',
      password: 'test-password',
    }

    await request(app).post("/auth/signup").send(auth);
    const signin = await request(app).post("/auth/signin").send(auth);
    const cookie = signin.headers['set-cookie'];

    for (const title in memo){
      const image = memo[title];
      const image_id = image._id;
      const response = await request(app).get(`/api/images/${image_id}/picture`).set('Cookie', cookie).send();
      // const responseBody = JSON.parse(response.text);
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('image/png');
    }
  })

  test('retrieve other users image', async () => {
    const auth = {
      username: 'test-username2',
      password: 'test-password2',
    }

    const signin = await request(app).post("/auth/signin").send(auth);
    const cookie = signin.headers['set-cookie'];

    for (const title in memo){
      const image = memo[title];
      const image_id = image._id;
      const response = await request(app).get(`/api/images/${image_id}/picture`).set('Cookie', cookie).send();
      // accessible to other user's public images
      if (image.isPublic){
        expect(response.status).toBe(200); // not allowed to retrieve other users image
        expect(response.headers['content-type']).toBe('image/png');
      }
      // but not other user's private images
      else{
        expect(response.status).toBe(403); // not allowed to retrieve other users image
        expect(response.headers['content-type']).toBe(undefined);
      }

    }
  })
})


// retrieve the image file
describe('DELETE /api/images/:id', () => {

  test('delete image without authentication', async () => {
    // const auth = {
    //   username: 'test-username',
    //   password: 'test-password',
    // }

    // const signin = await request(app).post("/auth/signin").send(auth);
    // const cookie = signin.headers['set-cookie'];

    // console.log('cookie', cookie)

    const response = await request(app).del('/api/images/0').send();
    // const responseBody = JSON.parse(response.text);
    expect(response.status).toBe(401);
    
  })

  // test('delete non-existent image', async () => {
  //   const auth = {
  //     username: 'test-username',
  //     password: 'test-password',
  //   }

  //   const signin = await request(app).post("/auth/signin").send(auth);
  //   const cookie = signin.headers['set-cookie'];

  //   console.log('cookie', cookie);

  //   request(app).delete('/api/images/0').set('Cookie', cookie).send().then((res) =>
  //     console.log(res)
  //   )
  //   // const responseBody = JSON.parse(response.text);
  // })
})