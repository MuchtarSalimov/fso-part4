const Blog = require('../models/blog')
const User = require('../models/user')


// Blogs

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    user: "6a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    user: "6a422a851b54a676234d17f7",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    user: "6a422a851b54a676234d17f7",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    user: "6a422a851b54a676234d17f7",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    user: "6a422a851b54a676234d17f7",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    user: "6a422a851b54a676234d17f7",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const nonExistingBlogId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

// Users

const initialUsers = [
  {
    _id: '6a422a851b54a676234d17f7',
    username: 'root',
    name: 'Fred Barley',
    passwordHash: '$2b$10$lc7z9XPlUeLlfY9EuykLpe/3JU9vG1zScNiZ2u3TnUWWF9OkQvWba',
    __v: 0
  }
]

const nonExistingUserId = async () => {
  const user = new User({ content: 'willremovethissoon' })
  await user.save()
  await user.deleteOne()

  return user._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingBlogId,
  blogsInDb,
  initialUsers,
  nonExistingUserId,
  usersInDb,
}