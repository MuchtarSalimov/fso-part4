require('express-async-errors')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.put('/:id', async (request, response) => {
  const updateObject = {}

  if ( request.body.title )  { updateObject['title'] = request.body.title }
  if ( request.body.author ) { updateObject['author'] = request.body.author }
  if ( request.body.likes )  { updateObject['likes'] = request.body.likes }

  const result = await Blog.findOneAndUpdate({ _id: request.params.id }, updateObject, { new: true })
  response.status(200).send(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.deleteOne({ _id: request.params.id })
  response.status(204).end()
})

blogsRouter.post('/', async (request, response) => {
  const input = request.body

  if ( !input.title || !input.author ) {
    response.status(400).end()
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