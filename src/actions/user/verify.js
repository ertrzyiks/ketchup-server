import {User} from '../../models'

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
