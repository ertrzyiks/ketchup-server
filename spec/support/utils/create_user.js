export async function createUser(app, userData) {
  const {Token} = app.models
  const {name, accessToken, refreshToken} = userData

  const result = await app.perform('user.signup', {name})
  const {user} = result
  const userId = user.get('id')

  if (accessToken) {
    await overwriteAccessToken(Token, userId, accessToken)
  }

  if (refreshToken) {
    await overwriteRefreshToken(Token, userId, refreshToken)
  }

  return user
}

async function overwriteAccessToken(Token, userId, value) {
  const accessToken = await Token.where({user_id: userId, type: 'access'}).fetch()
  await accessToken.set('value', value).save()
}

async function overwriteRefreshToken(Token, userId, value) {
  const refreshToken = await Token.where({user_id: userId, type: 'refresh'}).fetch()
  await refreshToken.set('value', value).save()
}
