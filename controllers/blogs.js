require('express-async-errors')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1})
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



    const user = await User.findOne({})

    const blog = new Blog({
      title: input.title,
      author: input.author,
      url: input.url,
      likes: input.likes || 0,
      user: user._id
    })
    const result = await blog.save()
    console.log('result', result)


    const updateObject = {
      $push: { blogs: result._id }
    }
    const randomUser = await User.findOneAndUpdate({ _id: user.id }, updateObject, { new: true })

    console.log('randomUser', randomUser)

    response.status(201).json(result)  
  }
})

module.exports = blogsRouter