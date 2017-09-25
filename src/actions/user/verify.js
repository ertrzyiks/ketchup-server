import {User} from '../../models'

/**
 * @param {object} params
 * @param {string} params.hash
 * @param {string} params.accessToken
 * @returns {boolean}
 * @memberof module:Actions/User
 */
async function verifyUser({hash, accessToken} = {}) {
  const user = await User.where({hash}).fetch()

  if (!user) {
    return false
  }

  const foundToken = user.get('tokens').find(token => token.value === accessToken)

  if (!foundToken) {
    return false
  }

  const expireAt = new Date(foundToken.expire_at).getTime()
  return expireAt >= Date.now()
}

export {verifyUser}
