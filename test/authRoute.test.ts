import boot from '../src/app';
import request from 'supertest';

const app = boot('test');

describe('POST /auth/signup/', () => {

  test('sign up unregistered username', async () => {

    const bodies = [
      {username: 'test-username', password: 'test-password'},
      {username: 'test-username2', password: 'test-password2'},
      {username: 'test-username3', password: 'test-password3'},
    ]
    for (const body of bodies){
      const response = await request(app).post("/auth/signup").send(body);
      expect(response.status).toBe(200);
    }
  })

  test('sign up registered username', async () => {
    const bodies = [
      {username: 'test-username', password: 'test-password'},
      {username: 'test-username2', password: 'test-password2'},
      {username: 'test-username3', password: 'test-password3'},
    ]
    for (const body of bodies){
      const response = await request(app).post("/auth/signup").send(body);
      expect(response.status).toBe(409);
    }
  })
})


describe('POST /auth/signin/', () => {

  test('sign in a unexisted username or password', async () => {
    const bodies = [
      {username: 'test-notexisted', password: 'test-password'},
      {username: 'test-username', password: 'test-notexisted'},
      {username: 'test-notexisted', password: 'test-notexisted'},
      
    ]
    for (const body of bodies){
      const response = await request(app).post("/auth/signin").send(body);
      expect(response.status).toBe(401);
    }
  })

  test('sign in a registered username', async () => {
    const body = {
      username: 'test-username',
      password: 'test-password',
    }

    const response = await request(app).post("/auth/signin").send(body);
    expect(response.status).toBe(200);
  })
})


describe('POST /auth/signout/', () => {

  test('sign out without authentication', async () => {

    const response = await request(app).get("/auth/signout");
    expect(response.status).toBe(401);
  })

  test('sign out in a registered username', async () => {
    const body = {
      username: 'test-username',
      password: 'test-password',
    }

    const signin = await request(app).post("/auth/signin").send(body);
    const cookie = signin.headers['set-cookie'];
    console.log(cookie)

    const response = await request(app).get("/auth/signout").set('Cookie', cookie);
    expect(response.status).toBe(200);
  })
})