import pick from 'lodash/pick'
import { User } from '../../models'

async function findUserByHash(hash) {
  const user = await User.where({ hash }).fetch()
  
  if (!user) {
    return null
  }
  
  return pick(user.toJSON(), ['id', 'hash', 'name', 'created_at', 'updated_at'])
}

export { findUserByHash }