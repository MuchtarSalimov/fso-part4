require('express-async-errors')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { hashPassword } = require('../utils/hash_password')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1, id: 1})
  response.json(users)
})

usersRouter.put('/:id', async (request, response) => {
  const updateObject = {}

  if ( request.body.username )  { updateObject['username'] = request.body.username }
  if ( request.body.name ) { updateObject['name'] = request.body.name }
  if ( request.body.password )  { updateObject['passwordHash'] = await hashPassword(request.body.password) }

  const result = await User.findOneAndUpdate({ _id: request.params.id }, updateObject, { new: true })
  response.status(200).send(result)
})

usersRouter.delete('/:id', async (request, response) => {
  await User.deleteOne({ _id: request.params.id })
  response.status(204).end()
})

usersRouter.post('/', async (request, response) => {
  const input = request.body

  if ( !input.username || input.username.length < 3 || !input.password || input.password.length < 3) {
    response.status(400).send({ error: 'username or password missing or less than 3 letters' })
  } else {
    const passwordHash = await hashPassword(input.password)

    const user = new User({
      username: input.username,
      name: input.name || '',
      passwordHash: passwordHash,
      blogs: []
    })
    const result = await user.save()
    response.status(201).json(result)  
  }
})

module.exports = usersRouter