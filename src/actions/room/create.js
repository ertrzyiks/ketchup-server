import ValidationError from '../../errors/validation_error'

export default async (app, performer, data = {}) => {
  const Room = app.models.Room
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

  const rooms = performer.get('rooms') || '[]'
  await performer.save('rooms', JSON.stringify(JSON.parse(rooms).concat([room.id])))

  return room
}
