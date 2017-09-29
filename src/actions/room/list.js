import { Room } from '../../models'

/**
 * @param performer
 * @returns {module:JsonModels.Room[]}
 * @memberof module:Actions/Room
 */
async function listUserRooms(performer) {
  const rooms = await Room.forge()
    .fetchAll({withRelated: ['users', {
        'users': function (qb) {
          qb.where({ id: performer.id })
        }
      }]
    })

  console.log(rooms.toJSON())

  const mappedRooms = rooms.toJSON().map(r => {
    let ownerInfo = {}
    const owner = r.users.find(u => u.id === r.owner_id)
    if (owner) {
      ownerInfo = { owner_id: owner.hash}
    }  
    return Object.assign({}, r, ownerInfo)
  })

  return mappedRooms
}

export { listUserRooms }
