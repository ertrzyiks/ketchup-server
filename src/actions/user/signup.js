import ValidationError from '../../errors/validation_error'

export default async (app, performer, data = {}) => {
  const {User, Token} = app.models
  const {name} = data

  try {
    const accessToken = await Token.forgeAccessToken()

    const user = await User.forge({
      name,
      tokens: [accessToken.toJSON()]
    }).save()

    const {rawValue, refreshToken} = await Token.forgeRefreshTokenFor(user.id)
    await refreshToken.save()

    await user.fetch()

    return {
      user: user.toJSON(),
      accessToken: accessToken.toJSON(),
      refreshToken: refreshToken.toOutputJSON(rawValue)
    }
  } catch (ex) {
    if (ex.message.match(/unique/i)) {
      throw new ValidationError('Username is already taken')
    }

    // TODO: report `ex` somehow
    console.error(ex)

    throw new Error('Could not register a user')
  }
}
