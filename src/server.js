import {Server} from 'logux-server'


export default class KetchupServer extends Server {
  constructor (ketchapp, ...args) {
    super(...args)

    this.ketchapp = ketchapp
    this._setupAuth()
    this._setupTypes()
  }

  perform(actionName, performer, data) {
    return this.ketchapp.perform(actionName, performer, data)
  }

  _setupAuth() {
    this.auth((id, accessToken) => {
      return this.perform('user.verify', {hash: id, accessToken})
    })
  }

  _setupTypes() {
    this.subscription('users/:id', (params, action, meta, creator) => {
      if (params.id !== creator.user) {
        return false
      }

      this.log.add(
        { type: 'LIST_ROOMS', rooms: [{name: 'Room #1' + creator.user}, {name: 'Room #2' + creator.user}] },
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
