import {Server} from 'logux-server'
import actions from './actions'
import models from './models'
import app from './app'

const ketchapp = app({
  models,
  actions
})

const app = new Server(
  Server.loadOptions(process, {
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname
  })
)

app.auth((userId, token) => {
    const User = ketchapp.models.User

    return User.forge({name: userId}).fetch()
      .then((user) => {
        if (!user) {
          return User.forge({name: userId}).save(null, {method: 'insert'})
        }
      })
      .then(() => true)
})

app.type('CREATE_ROOM', {
  access: (action, meta) => {
    return Promise.resolve(true)
  },
  process: (action, meta, creator) => {
    console.log('ACTION', action, meta, creator)
    // var user = app.models.User.forge({id: creator.user}).fetch()
    // return app.perform('room.create', user, 'Room 1')
  }
})

app.listen()
