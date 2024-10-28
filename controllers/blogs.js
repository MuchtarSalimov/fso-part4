require('express-async-errors')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  const input = request.body

  if ( !input.title || !input.author ) {
    response.status(400).send({ error: 'title or author missing' })
  } else {
    const blog = new Blog({
      title: input.title,
      author: input.author,
      url: input.url,
      likes: input.likes || 0
    })
    const result = await blog.save()
    response.status(201).json(result)  
  }
})

module.exports = blogsRouter