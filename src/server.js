import {Server} from 'logux-server'
import actions from './actions'
import models from './models'
import app from './app'

export default class KetchupServer extends Server {
  constructor (...args) {
    super(...args)

    this.ketchapp = app({
      models,
      actions
    })

    this._setupAuth()
    this._setupTypes()
  }

  perform(actionName, performer, data) {
    return this.ketchapp.perform(actionName, performer, data)
  }

  _setupAuth() {
    this.auth((name, token) => {
      return this.perform('user.verify', {name, token})
    })
  }

  _setupTypes() {
    this.type('CREATE_ROOM', {
      access: (action, meta) => {
        return Promise.resolve(true)
      },
      process: (action, meta, creator) => {
        console.log('ACTION', action, meta, creator)
        // var user = app.models.User.forge({id: creator.user}).fetch()
        // return app.perform('room.create', user, 'Room 1')
      }
    })
  }
}
