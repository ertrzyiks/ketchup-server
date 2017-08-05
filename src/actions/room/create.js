export default (app, performer, data = {}) => {
  const Room = app.models.Room
  const {roomName} = data

  if (!roomName) {
    return Promise.reject(new Error('Room name can not be empty'))
  }

  return Room.forge({
    name: data.roomName,
    owner_id: performer.id
  }).save()
}
