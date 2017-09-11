import AuthenticationError from '../../errors/authentication_error'

export default async (app, performer, data = {}) => {
  const {User, Token} = app.models
  const {hash, refreshToken} = data

  const user = await User.where({hash}).fetch()
  const userId = user ? user.id : -1

  const allRefreshTokens = await Token
    .query(function (qb) {
      qb.where('user_id', userId).andWhere('expire_at', '>=', new Date())
      qb.orderBy('expire_at', 'desc')
      qb.limit(3)
    })
    .fetchAll()

  const foundToken = await getMatchingToken(Token, refreshToken, allRefreshTokens)

  if (foundToken === null) {
    throw new AuthenticationError('Incorrect credentials')
  }

  const newAccessToken = await Token.forgeAccessToken()
  await user.addToken(newAccessToken).save()

  const {rawValue, refreshToken: newRefreshToken} = await Token.forgeRefreshTokenFor(user.id)
  await newRefreshToken.save()

  return {
    user: user.toJSON(),
    accessToken: newAccessToken.toJSON(),
    refreshToken: newRefreshToken.toOutputJSON(rawValue)
  }
}

async function getMatchingToken(Token, refreshToken, tokens) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens.at(i)
    const res = await Token.compare(refreshToken, token.get('value'))
    if (res) {
      return token
    }
  }

  return null
}
