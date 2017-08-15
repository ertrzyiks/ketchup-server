export default async (app, performer, data = {}) => {
  const {User, Token} = app.models
  const {name, accessToken} = data

  // TODO: make a single query here
  const user = await User.where({name}).fetch()
  const userId = user ? user.get('id') : -1

  const foundToken = await Token
    .where('user_id', userId)
    .where('value', accessToken)
    .where('type', 'access')
    .fetch()

  if (foundToken === null) {
      return false
  }

  const expireAt = foundToken.get('expire_at')
  return expireAt >= Date.now()
}
