export async function createUser(app, userData) {
  const {Token, User} = app.models
  const {name, accessToken, refreshToken} = Object.assign({name: 'MyUser'}, userData)

  const result = await app.signUp({name})
  const {user} = result
  const userId = user.id

  if (accessToken) {
    await overwriteAccessToken(Token, User, userId, accessToken)
  }

  if (refreshToken) {
    await overwriteRefreshToken(Token, userId, refreshToken)
  }

  return user
}

async function overwriteAccessToken(Token, User, userId, value) {
  const user = await User.forge({id: userId}).fetch()
  const accessToken = await Token.forgeAccessToken()
  accessToken.set('value', value)
  await user.save('tokens', [accessToken.toJSON()])
}

async function overwriteRefreshToken(Token, userId, rawValue) {
  const refreshToken = await Token.where({user_id: userId}).fetch()
  const value = await Token.encrypt(rawValue)
  await refreshToken.set('value', value).save()
}
