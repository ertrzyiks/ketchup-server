import {Server} from 'logux-server'
import actions from './actions'
import models from './models'
import app from './app'

class KetchupServer extends Server {
  constructor (options) {
    this.ketchapp = app({
      models,
      actions
    })

    super(options)
  }
}

const server = new KetchupServer(
  Server.loadOptions(process, {
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname
  })
)

server.auth(function (name, token) {
  return server.ketchapp.perform('user.verify', {name, token})
})

server.type('CREATE_ROOM', {
  access: (action, meta) => {
    return Promise.resolve(true)
  },
  process: (action, meta, creator) => {
    console.log('ACTION', action, meta, creator)
    // var user = app.models.User.forge({id: creator.user}).fetch()
    // return app.perform('room.create', user, 'Room 1')
  }
})

export default server
