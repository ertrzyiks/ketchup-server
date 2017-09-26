import {Server} from 'logux-server'
import {verifyUser} from './actions/user'
import { Room } from './models'
import { createRoom } from './actions/room/create'
import { findUserByHash } from './actions/user/find'
import { listUserRooms } from './actions/room/list'
import { deleteRoom } from './actions/room/delete'

export default class KetchupServer extends Server {
  /**
   * This is a server created with [logux-server](https://github.com/logux/logux-server)
   *
   * @class KetchupServer
   * @arg {String} a
   */
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
    this.channel('users/:id', async (params, action, meta, creator) => {
      console.log('init request', params.id)

      if (params.id !== creator.userId) {
        return false
      }

      // TODO: fetch also rooms to which the user is invited
      const user = await findUserByHash(creator.userId)
      if (!user) {
        console.log('User not found')
        return
      }

      const rooms = await listUserRooms(user)

      return this.log.add({ type: 'LIST_ROOMS', rooms }, { sync: true, nodeIds: [creator.nodeId], reasons: ['list'] })

    })

    // TODO: this is a noop for any events published but not handled by the server (it has to know about all the events)
    this.type('LIST_ROOMS', {
      access: (action, meta) => {
        return Promise.resolve(true)
      },
      process: (action, meta, creator) => {}
    })

    this.type('CREATED_ROOM_DETAILS', {
      access: (action, meta) => {
        return Promise.resolve(true)
      },
      process: (action, meta, creator) => {}
    })

    this.type('CREATE_ROOM', {
      access: (action, meta) => {
        return Promise.resolve(true)
      },
      process: async (action, meta, creator) => {
        const randomName = `temp-${Math.random() * 100}`

        const user = await findUserByHash(creator.userId)
        if (!user) {
          console.log('User not found')
          return
        }

        const room = await createRoom(user, { roomName: randomName })
        console.log('room', room)

        return this.log.add({ type: 'CREATED_ROOM_DETAILS', room }, { sync: true, nodeIds: [creator.nodeId], reasons: ['createRoomResponse'] })
      }
    })

    // noop by design
    this.type('REMOVE_ROOM_DETAILS', {
      access: (action, meta) => {
        return Promise.resolve(true)
      },
      process: (action, meta, creator) => {
      }
    })
    
    this.type('DELETE_ROOM', {
      access: (action, meta) => {
        return Promise.resolve(true)
      },
      process: async (action, meta, creator) => {
        console.log('delete room action', action)

        const user = await findUserByHash(creator.user)
        if (!user) {
          console.log('User not found')
          return
        }
        
        await deleteRoom(user, action.roomId)  
          
        return this.log.add({ type: 'REMOVE_ROOM_DETAILS', roomId: action.roomId }, { sync: true, nodeIds: [creator.nodeId], reasons: ['removeRoomDetails'] })
      }
    })

    this.type('REMOVE_FROM_ROOM', {
      access: (action, meta) => {
        return Promise.resolve(true)
      },
      process: (action, meta, creator) => {
        console.log('server - remove from room')
      }
    })
  }
}
