export default async (app, data = {}) => {
  const User = app.models.User
  const Token = app.models.Token
  const {name} = data

  const user = await User.forge({name}).save()

  const accessToken = await Token.forgeAccessTokenFor(user.get('id'))
  await accessToken.save()

  const refreshToken = await Token.forgeRefreshTokenFor(user.get('id'))
  await refreshToken.save()

  return user
}
