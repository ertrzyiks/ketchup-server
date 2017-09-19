import pick from 'lodash/pick'
import {getJsonNestedUser} from './user'

/**
 * @typedef {Object} Room
 * @property {Number} id - Identifier
 * @property {String} name - Room name
 * @property {String} owner_id - User identifier of the owner
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {module:JsonModels.NestedUser[]} users - Room members
 * @memberof module:JsonModels
 */
const getJsonRoom = (room) => {
  const roomJson = pick(room, ['id', 'name', 'created_at', 'updated_at'])
  const users = room.users.map(user => getJsonNestedUser(user))
  const owner_id = room.owner.hash

  return Object.assign({}, roomJson, {users}, {owner_id})
}

export {getJsonRoom}
