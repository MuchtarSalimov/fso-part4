const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const initialValue = 0
  return blogs.map(element=>element.likes).reduce((accumulator, currentValue) => accumulator + currentValue, initialValue)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0 )
    return null

  let blog = blogs[0]
  blogs.forEach(element => {
    if (element.likes > blog.likes) {
      blog = element
    }
  })
  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0 )
    return null

  const blogCountByAuthor = _.countBy(blogs.map(element => element.author), element => element)
  const mostBloggedAuhtor = _.maxBy(Object.entries(blogCountByAuthor), element => element[1])

  return {
    author: mostBloggedAuhtor[0],
    blogs: mostBloggedAuhtor[1]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0 )
    return null
  
  const likesPerAuthor = {}

  blogs.forEach((blog) => {
    if ( !likesPerAuthor.hasOwnProperty(blog.author) ) {
      likesPerAuthor[blog.author] = blog.likes
    } else {
      likesPerAuthor[blog.author] += blog.likes
    }
  })

  const [author, likes] = _.maxBy(Object.entries(likesPerAuthor), element => element[1])

  return { author, likes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}