require('dotenv').config()
const process = require('node:process')

const PORT = 3003
const MONGODB_URI = process.env.MONGODB_URI
module.exports = {
  MONGODB_URI,
  PORT
}