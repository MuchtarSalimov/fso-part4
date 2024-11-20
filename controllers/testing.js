require('express-async-errors')
const baseRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

baseRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = baseRouter