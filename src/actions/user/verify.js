export default async (app, data = {}) => {
  const User = app.models.User
  const Token = app.models.Token
  const {name, token} = data

  const user = await User.where({name}).fetch()
  return Token
    .where({user_id: user.get('id'), type: 'access'})
    .fetch()
    .then(token => !!token)
}
