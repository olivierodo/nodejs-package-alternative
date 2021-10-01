import express from 'express'
import supertest from 'supertest'
import got from 'got'
import fetch from 'node-fetch'
import axios from 'axios'

const app = express()
  .use(express.json())
  .get('/hello', (req, res) => res.json({ message: 'hello world' }))
  .post('/users', (req, res) => res.status(201).json({ id: 1, name: 'Joe' }))

describe('[SUPERTEST] Http server Testing', () => {
  test('GET /hello (200)', async () => {
    const response = await supertest(app).get('/hello')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('hello world')
  })

  test('POST /users (201)', async () => {
    const response = await supertest(app)
      .post('/users')
      .send({name: 'Joe'})
    expect(response.status).toBe(201)
    const expectedBody = {
      id: 1,
      name: 'Joe'
    }
    expect(response.body).toEqual(expectedBody)
  })

  test('GET /login 404', async () => {
    const response = await supertest(app).get('/login')
    expect(response.status).toBe(404)
    expect(response.header['content-type']).toEqual(expect.stringContaining('text/html'))
  })
})

describe('[GOT] Http server Testing', () => {
  test('GET /hello (200)', async () => {
    const server = app.listen(0)
    const { port } = server.address()
    const instance = got.extend({
      prefixUrl: `http://127.0.0.1:${port}`,
      responseType: 'json'
    })
    const response = await instance.get('hello')
    server.close()
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('hello world')
  })

  test('POST /users (201)', async () => {
    const server = app.listen(0)
    const { port } = server.address()
    const instance = got.extend({
      prefixUrl: `http://127.0.0.1:${port}`,
      responseType: 'json'
    })
    const response = await instance.post('users', {
      json: { 
        name: 'Joe'
      }
    })
    server.close()
    expect(response.statusCode).toBe(201)
    const expectedBody = {
      id: 1,
      name: 'Joe'
    }
    expect(response.body).toEqual(expectedBody)
  })

  test('GET /login 404', async () => {
    const server = app.listen(0)
    const { port } = server.address()
    const instance = got.extend({
      prefixUrl: `http://127.0.0.1:${port}`,
      responseType: 'json',
      throwHttpErrors: false
    })
    const response = await instance.get('login')
    server.close()
    expect(response.statusCode).toBe(404)
    expect(response.headers['content-type']).toEqual(expect.stringContaining('text/html'))
  })
})

describe('[AXIOS] Http server Testing', () => {
  test('GET /hello (200)', async () => {
    const server = app.listen(0)
    const { port } = server.address()
    const instance = axios.create({
      baseURL: `http://127.0.0.1:${port}`,
      responseType: 'json'
    })
    const response = await instance.get('hello')
    server.close()
    expect(response.status).toBe(200)
    expect(response.data.message).toBe('hello world')
  })

  test('POST /users (201)', async () => {
    const server = app.listen(0)
    const { port } = server.address()
    const instance = axios.create({
      baseURL: `http://127.0.0.1:${port}`,
      responseType: 'json'
    })
    const response = await instance.post('users', {  name: 'Joe' })
    server.close()
    expect(response.status).toBe(201)
    const expectedBody = {
      id: 1,
      name: 'Joe'
    }
    expect(response.data).toEqual(expectedBody)
  })

  test('GET /login 404', async () => {
    const server = app.listen(0)
    const { port } = server.address()
    const instance = axios.create({
      baseURL: `http://127.0.0.1:${port}`,
      responseType: 'json',
      validateStatus: () => true
    })
    const response = await instance.get('login')
    server.close()
    expect(response.status).toBe(404)
    expect(response.headers['content-type']).toEqual(expect.stringContaining('text/html'))
  })
})

describe('[NODE-FETCH] Http server Testing', () => {
  test('GET /hello (200)', async () => {
    const server = app.listen(0)
    const { port } = server.address()
    const response = await fetch(`http://127.0.0.1:${port}/hello`)
    server.close()
    expect(response.status).toBe(200)
    expect(response.json()).resolves.toEqual({ message: 'hello world' })
  })

  test('POST /users (201)', async () => {
    const server = app.listen(0)
    const { port } = server.address()
    const response = await fetch(`http://127.0.0.1:${port}/users`, {
      method: 'post',
      body: JSON.stringify({ name: 'Joe' }),
      headers: {'Content-Type': 'application/json'}
    });
    server.close()
    expect(response.status).toBe(201)
    const expectedBody = {
      id: 1,
      name: 'Joe'
    }
    expect(response.json()).resolves.toEqual(expectedBody)
  })

  test('GET /login 404', async () => {
    const server = app.listen(0)
    const { port } = server.address()
    const response = await fetch(`http://127.0.0.1:${port}/login`)
    server.close()
    expect(response.status).toBe(404)
    expect(response.headers.get('content-type')).toEqual(expect.stringContaining('text/html'))
  })
})
