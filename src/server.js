import {Server} from 'logux-server'
import {verifyUser} from './actions/user'

export default class KetchupServer extends Server {
  constructor (...args) {
    super(...args)

    this._setupAuth()
    this._setupTypes()
  }

  _setupAuth() {
    this.auth((id, accessToken) => {
      return verifyUser({hash: id, accessToken})
    })
  }

  _setupTypes() {
    this.subscription('users/:id', (params, action, meta, creator) => {
      if (params.id !== creator.user) {
        return false
      }

      this.log.add(
        { type: 'LIST_ROOMS', rooms: [{name: 'Room #1' + creator.user, creatorId: creator.user }, {name: 'Room #2' + creator.user, creatorId: creator.user}] },
        { nodeIds: [creator.nodeId], reasons: ['list'] }
      )
      return true
    })

    this.type('LIST_ROOMS', {
      access: (action, meta) => {
        return Promise.resolve(true)
      },
      process: (action, meta, creator) => {}
    })

    this.type('CREATE_ROOM', {
      access: (action, meta) => {
        return Promise.resolve(true)
      },
      process: (action, meta, creator) => {
        console.log('ACTION', action, meta, creator)
        console.log('ACTION ID', meta.id)
        // var user = app.models.User.forge({id: creator.user}).fetch()
        // return app.perform('room.create', user, 'Room 1')
      }
    })
  }
}
