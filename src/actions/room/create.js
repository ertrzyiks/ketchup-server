import pick from 'lodash/pick'
import ValidationError from '../../errors/validation_error'

export default async (app, performer, data = {}) => {
  const {Room} = app.models
  const {roomName} = data

  if (!roomName) {
    throw new ValidationError('Room name can not be empty')
  }

  const room = Room.forge({
    name: data.roomName,
    owner_id: performer.id
  })

  await room.save()
  await room.users().attach(performer.id)
  await room.fetch({withRelated: ['users']})

  const roomJson = room.toJSON()

  const users = roomJson.users.map(user => {
    return pick(user, ['id', 'hash', 'name', 'created_at', 'updated_at'])
  })

  return Object.assign({}, roomJson, {users})
}
