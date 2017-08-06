export default async (app, performer, data = {}) => {
  const {User, Token} = app.models
  const {name} = data

  const user = await User.forge({name}).save()

  const accessToken = await Token.forgeAccessTokenFor(user.get('id'))
  await accessToken.save()

  const refreshToken = await Token.forgeRefreshTokenFor(user.get('id'))
  await refreshToken.save()

  return user
}
