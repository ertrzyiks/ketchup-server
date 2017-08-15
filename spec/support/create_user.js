export async function createUser(app, userData) {
  const {Token} = app.models
  const {username, access_token, refresh_token} = userData

  const user = await app.perform('user.signup', {name: username})

  const accessToken = await Token.where({user_id: user.get('id'), type: 'access'}).fetch()
  await accessToken.set('value', access_token).save()

  if (refresh_token) {
    const refreshToken = await Token.where({user_id: user.get('id'), type: 'refresh'}).fetch()
    await refreshToken.set('value', refresh_token).save()
  }
}
