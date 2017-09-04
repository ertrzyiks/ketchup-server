import AuthenticationError from '../../errors/authentication_error'

export default async (app, performer, data = {}) => {
  const {User, Token} = app.models
  const {hash, refreshToken} = data

  // TODO: make a single query here
  const user = await User.where({hash}).fetch()
  const userId = user ? user.id : -1

  const foundToken = await Token
    .where('user_id', userId)
    .where('value', refreshToken)
    .fetch()

  if (foundToken === null) {
    throw new AuthenticationError('Incorrect credentials')
  }

  const expireAt = foundToken.get('expire_at')

  if (expireAt < Date.now()) {
    throw new AuthenticationError('Incorrect credentials')
  }

  const newAccessToken = await Token.forgeAccessToken()
  await user.addToken(newAccessToken).save()

  const newRefreshToken = await Token.forgeRefreshTokenFor(user.id)
  await newRefreshToken.save()

  return {
    user: user.toJSON(),
    accessToken: newAccessToken.toJSON(),
    refreshToken: newRefreshToken.toJSON()
  }
}
