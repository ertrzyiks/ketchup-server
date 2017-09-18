import { Room } from '../../models'

async function listUserRooms(performer) {
  const rooms = await Room.forge()
  .fetchAll({withRelated: ['users', {
      'users': function (qb) {
        qb.where({ id: performer.id })
      }
    }]
  })

  const mappedRooms = rooms.toJSON().map(r => {
    const ownerHash = r.users.find(u => u.id === r.owner_id).hash
    return Object.assign({}, r, { owner_id: ownerHash })
  })

  return mappedRooms
}

export { listUserRooms }