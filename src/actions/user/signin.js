export default async (app, performer, data = {}) => {
  const {User, Token} = app.models
  const {name, refreshToken} = data

  // TODO: make a single query here
  const user = await User.where({name}).fetch()
  const userId = user ? user.get('id') : -1

  const foundToken = await Token
    .where('user_id', userId)
    .where('value', refreshToken)
    .where('type', 'refresh')
    .fetch()

  if (foundToken === null) {
    return null
  }

  const newAccessToken = await Token.forgeAccessTokenFor(user.get('id'))
  await newAccessToken.save()

  const newRefreshToken = await Token.forgeRefreshTokenFor(user.get('id'))
  await newRefreshToken.save()

  return {user, accessToken: newAccessToken, refreshToken: newRefreshToken}
}
