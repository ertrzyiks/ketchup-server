export default async function verifyUser(app, performer, data = {}) {
  const {User} = app.models
  const {hash, accessToken} = data

  // TODO: make a single query here
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
