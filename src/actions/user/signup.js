import ValidationError from '../../errors/validation_error'

export default async (app, performer, data = {}) => {
  const {User, Token} = app.models
  const {name} = data

  try {
    const user = await User.forge({name}).save()

    const accessToken = await Token.forgeAccessTokenFor(user.get('id'))
    await accessToken.save()

    const refreshToken = await Token.forgeRefreshTokenFor(user.get('id'))
    await refreshToken.save()

    return {user, accessToken, refreshToken}
  } catch (ex) {
    if (ex.message.match(/unique/i)) {
      throw new ValidationError('Username is already taken')
    }

    // TODO: report `ex` somehow
    console.error(ex)

    throw new Error('Could not register a user')
  }
}
