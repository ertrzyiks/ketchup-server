import { Room } from '../../models'

/**
 * @param performer
 * @param {number} roomId
 * @returns {number} Given room id
 * @memberof module:Actions/Room
 */
async function deleteRoom(performer, roomId) {
  const room = await Room.forge({ id: roomId })
    .fetch()
  
  if (!room) {
    return roomId
  }
  
  if (room.toJSON().owner_id !== performer.id) {
    throw Error('Only the owner can delete a room')
  }
  
  await room.destroy()

  return roomId
}

export { deleteRoom }
