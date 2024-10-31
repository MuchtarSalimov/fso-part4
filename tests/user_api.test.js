const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const User = require('../models/user')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  
  const userObjects = helper.initialUsers.map(user => new User(user))
  const promiseArray = userObjects.map(user => {
    return user.save()
  })

  await Promise.all(promiseArray)
})

test('number of users in initial test data is 1', async () => {
  const response = await api
  .get('/api/users')
  .expect(200)
  .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 1)
})

test('GET /api/users provides id instead of _id', async () => {
  const response = await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body[0].hasOwnProperty('id'), true)
  assert.strictEqual(response.body[0].hasOwnProperty('_id'), false)
})

test('POST /api/users successfully adds a new user', async () => {
  const oldUserList = await api.get('/api/users')
  const oldUserCount = oldUserList.body.length

  await api
    .post('/api/users')
    .send( {
      "username": "brisketmuffin",
      "name": "John Swan",
      "password": 'abc'
    })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const newUserList = await api.get('/api/users')
  const newUserCount = newUserList.body.length

  assert.strictEqual(newUserCount, oldUserCount + 1)
})

test('POST /api/users fails to add if username exists', async () => {
  const oldUserList = await api.get('/api/users')
  const oldUserCount = oldUserList.body.length

  await api
    .post('/api/users')
    .send( {
      "username": "root",
      "name": "John Swan",
      "password": 'abc'
    })
    .expect(500)

  const newUserList = await api.get('/api/users')
  const newUserCount = newUserList.body.length

  assert.strictEqual(newUserCount, oldUserCount)
})

test('adding a user with no username specified returns 400 Bad Request', async () => {
  await api
    .post('/api/users')
    .send( {
      "name": "John Swan",
      "password": "abc",
    })
    .expect(400)
})

test('adding a user with username shorter than 3 chars returns 400 Bad Request', async () => {
  await api
    .post('/api/users')
    .send( {
      "username": "br",
      "name": "John Swan",
      "password": 'abc'
    })
    .expect(400)
})

test('adding a user with no password specified returns 400 Bad Request', async () => {
  await api
    .post('/api/users')
    .send( {
      "username": "shirleyworld",
      "name": "John Swan",
    })
    .expect(400)
})

test('adding a user with password shorter than 3 chars returns 400 Bad Request', async () => {
  await api
    .post('/api/users')
    .send( {
      "username": "br",
      "name": "John Swan",
      "password": 'ab'
    })
    .expect(400)
})

// describe('test delete works', () => {
//   test('DELETE /api/users/:id successfully deletes post', async () => {
//     const oldUserList = await api.get('/api/users')
//     const oldUserCount = oldUserList.body.length
  
//     await api
//       .delete('/api/users/5a422a851b54a676234d17f7')
//       .expect(204)
  
//     const newUserList = await api.get('/api/users')
//     const newUserCount = newUserList.body.length
  
//     assert.strictEqual(newUserCount, oldUserCount - 1)
//   })  
// })

// describe('test if updating user works works', () => {
//   test('update title of a user successfully', async () => {
//     const response = await api
//       .put('/api/users/5a422a851b54a676234d17f7')
//       .send({
//         title: 'Potatoes are our friends'
//       })
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
  
//     assert.strictEqual(response.body.title, 'Potatoes are our friends')
//   })

//   test('update author of a user successfully', async () => {
//     const response = await api
//       .put('/api/users/5a422a851b54a676234d17f7')
//       .send({
//         author: 'Fred Flinstone'
//       })
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
  
//     assert.strictEqual(response.body.author, 'Fred Flinstone')
//   })

//   test('update likes of a user successfully', async () => {
//     const response = await api
//       .put('/api/users/5a422a851b54a676234d17f7')
//       .send({
//         likes: 24
//       })
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
  
//     assert.strictEqual(response.body.likes, 24)
//   })
// })

after(async () => {
  await mongoose.connection.close()
})