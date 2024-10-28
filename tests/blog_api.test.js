const { test, after, beforeEach } = require('node:test')
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
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 6)
})

test('GET /api/blogs provies id instead of _id', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body[0].hasOwnProperty('id'), true)
  assert.strictEqual(response.body[0].hasOwnProperty('_id'), false)
})

test('POST /api/blogs successfully adds a new blog', async () => {

  const oldBlogList = await api.get('/api/blogs')
  const oldBlogCount = oldBlogList.body.length

  await api.post('/api/blogs').send( {
    "title": "My favourite burger is a backyard barbecue burger",
    "author": "John Swan",
    "url": "https://www.JohnSwanBlog.com/my_favourite_burger",
    "likes": 30
  })

  const newBlogList = await api.get('/api/blogs')
  const newBlogCount = newBlogList.body.length

  assert.strictEqual(newBlogCount, oldBlogCount + 1)


})


// test('blogs json id matches the format of a default mongodb _id value', async () => {
//   const response = await api.get('/api/blogs')
//
//   assert.strictEqual(/^[a-fA-F0-9]{24}$/.test(response.body[0].id), true)
// })

after(async () => {
  await mongoose.connection.close()
})