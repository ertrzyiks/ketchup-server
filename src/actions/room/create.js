import pick from 'lodash/pick'
import ValidationError from '../../errors/validation_error'
import {Room} from '../../models'

async function createRoom(performer, {roomName} = {}) {
  if (!roomName) {
    throw new ValidationError('Room name can not be empty')
  }

  const room = Room.forge({
    name: roomName,
    owner_id: performer.id
  })

  await room.save()
  await room.users().attach(performer.id)
  await room.fetch({withRelated: ['users', 'owner']})

  const roomJson = room.toJSON()

  const users = roomJson.users.map(user => {
    return pick(user, ['id', 'hash', 'name', 'created_at', 'updated_at'])
  })

  const ownerId = roomJson.owner.hash

  return Object.assign({}, roomJson, {users}, { owner_id: ownerId })
}

export {createRoom}
