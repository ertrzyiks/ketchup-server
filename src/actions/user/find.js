import {User} from '../../models'
import {getJsonUser} from '../../json_models'

/**
 * @param {string} hash - User hash
 * @returns {Object}
 * @memberof module:Actions/User
 */
async function findUserByHash(hash) {
  const user = await User.where({ hash }).fetch()
  
  if (!user) {
    return null
  }
  
  return user.toJSON()
}

export { findUserByHash }
