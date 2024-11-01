const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const tokenExtractor = (request, response, next) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  
  request.token = decodedToken || null

  next()
}

const userExtractor = (request, response, next) => {
  const token = getTokenFrom(request)
  if ( token ) {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

    request.user = decodedToken.id || null
  } else {
    request.user = null
  }

  next()
}



module.exports = {
  tokenExtractor,
  userExtractor
}