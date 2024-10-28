const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => {
    return blog.save()
  })

  await Promise.all(promiseArray)
})

test('number of blogs in initial test data is 6', async () => {
  const response = await api
  .get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 6)
})

test('GET /api/blogs provies id instead of _id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body[0].hasOwnProperty('id'), true)
  assert.strictEqual(response.body[0].hasOwnProperty('_id'), false)
})

test('POST /api/blogs successfully adds a new blog', async () => {
  const oldBlogList = await api.get('/api/blogs')
  const oldBlogCount = oldBlogList.body.length

  await api
    .post('/api/blogs')
    .send( {
      "title": "My favourite burger is a backyard barbecue burger",
      "author": "John Swan",
      "url": "https://www.JohnSwanBlog.com/my_favourite_burger",
      "likes": 30
    })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const newBlogList = await api.get('/api/blogs')
  const newBlogCount = newBlogList.body.length

  assert.strictEqual(newBlogCount, oldBlogCount + 1)
})

test('adding blog defaults likes to 0 if not specified', async () => {
  const result = await api
    .post('/api/blogs')
    .send( {
      "title": "My favourite burger is a backyard barbecue burger",
      "author": "John Swan",
      "url": "https://www.JohnSwanBlog.com/my_favourite_burger",
    })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(result.body.likes, 0)
})

test('adding a blog with no title specified returns 400 Bad Request', async () => {
  await api
    .post('/api/blogs')
    .send( {
      "author": "John Swan",
      "url": "https://www.JohnSwanBlog.com/my_favourite_burger",
    })
    .expect(400)
})

test('adding a blog with no author specified returns 400 Bad Request', async () => {
  await api
    .post('/api/blogs')
    .send( {
      "title": "My favourite burger is a backyard barbecue burger",
      "url": "https://www.JohnSwanBlog.com/my_favourite_burger",
    })
    .expect(400)
})

describe('test delete works', () => {
  test('DELETE /api/blogs/:id successfully deletes post', async () => {
    const oldBlogList = await api.get('/api/blogs')
    const oldBlogCount = oldBlogList.body.length
  
    await api
      .delete('/api/blogs/5a422a851b54a676234d17f7')
      .expect(204)
  
    const newBlogList = await api.get('/api/blogs')
    const newBlogCount = newBlogList.body.length
  
    assert.strictEqual(newBlogCount, oldBlogCount - 1)
  })  
})

describe('test if updating blog works works', () => {
  test('update title of a blog successfully', async () => {
    const response = await api
      .put('/api/blogs/5a422a851b54a676234d17f7')
      .send({
        title: 'Potatoes are our friends'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(response.body.title, 'Potatoes are our friends')
  })

  test('update author of a blog successfully', async () => {
    const response = await api
      .put('/api/blogs/5a422a851b54a676234d17f7')
      .send({
        author: 'Fred Flinstone'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(response.body.author, 'Fred Flinstone')
  })

  test('update likes of a blog successfully', async () => {
    const response = await api
      .put('/api/blogs/5a422a851b54a676234d17f7')
      .send({
        likes: 24
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(response.body.likes, 24)
  })
})

// test('blogs json id matches the format of a default mongodb _id value', async () => {
//   const response = await api.get('/api/blogs')
//
//   assert.strictEqual(/^[a-fA-F0-9]{24}$/.test(response.body[0].id), true)
// })

after(async () => {
  await mongoose.connection.close()
})