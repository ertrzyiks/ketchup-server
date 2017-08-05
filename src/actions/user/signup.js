export default (app, data = {}) => {
  const User = app.models.User
  const Token = app.models.Token
  const {name} = data

  const createUser = User.forge({name: name}).save()

  return createUser
    .then(user => {
      const accessToken = Token.forgeAccessTokenFor(user.get('id')).save()
      const refreshToken = Token.forgeRefreshTokenFor(user.get('id')).save()

      return Promise.all([user, accessToken, refreshToken])
    })
    .then(values => values[0])
}
