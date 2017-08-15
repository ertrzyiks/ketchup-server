import ValidationError from '../../errors/validation_error'

export default async (app, performer, data = {}) => {
  const Room = app.models.Room
  const {roomName} = data

  if (!roomName) {
    throw new ValidationError('Room name can not be empty')
  }

  return Room.forge({
    name: data.roomName,
    owner_id: performer.id
  }).save()
}
