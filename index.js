'use strict'

const Hapi = require('hapi')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/brain-games-server')
const db = mongoose.connection

const server = Hapi.server({
    port: 8000,
    host: 'localhost'
})

const UserSchema = mongoose.Schema({
  username: String,
  password: String
})

const User = mongoose.model('User', UserSchema)

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        return 'Hello, world!'
    }
})

server.route({
    method: 'GET',
    path: '/{name}',
    handler: (request, h) => {

        return 'Hello, ' + encodeURIComponent(request.params.name) + '!'
    }
})

server.route({
  method: 'POST',
  path: '/user',
  handler: async (req, h) => {

    const hash = await bcrypt.hash(req.payload.password, 10)
    new User({
      username: req.payload.username,
      password: hash
    })
    .save()
    .then((err, res) => console.log(err, res))
      return 'Hello!'
  }
})

const init = async () => {

    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {

    console.log(err)
    process.exit(1)
})

init()