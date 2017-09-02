import ValidationError from '../../errors/validation_error'

export default async (app, performer, data = {}) => {
  const {User, Room} = app.models
  const {roomName} = data

  if (!roomName) {
    throw new ValidationError('Room name can not be empty')
  }

  const room = Room.forge({
    name: data.roomName,
    owner_id: performer.id,
    users: JSON.stringify([performer.id])
  })

  await room.save()

  const rooms = performer.rooms || '[]'
  await User.forge({id: performer.id}).save('rooms', rooms.concat([room.id]))

  return room.toJSON()
}
