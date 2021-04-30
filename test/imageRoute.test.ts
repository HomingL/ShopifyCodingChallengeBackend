import boot from '../src/app';
import request from 'supertest';

const app = boot('test');

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

    const bodies = [
      {title: 'title1', isPublic: true},
      {title: 'title2', isPublic: true},
      {title: 'title3', isPublic: true},
    ]
    for (const body of bodies){
      // const response = await request(app).post("/api/images").set('Cookie', cookie).send(body);
      const req = request(app).post("/api/images").set('Cookie', cookie);
      console.log('request:', req);
      const response = await req.send(body);
      console.log('response', response);
      expect(response.status).toBe(200);
    }
  })
})
