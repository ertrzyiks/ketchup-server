import ValidationError from '../../errors/validation_error'
import {Room} from '../../models'
import {getJsonRoom} from '../../json_models'

/**
 * @param performer
 * @param {object} params
 * @param {string} params.roomName - Name of room
 * @returns {module:JsonModels.Room}
 * @memberof module:Actions/Room
 */
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

  return getJsonRoom(room.toJSON())
}

export {createRoom}
