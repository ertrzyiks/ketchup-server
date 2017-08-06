export default async (app, data = {}) => {
  const User = app.models.User
  const Token = app.models.Token
  const {name, token} = data

  const user = await User.where({name}).fetch()
  const foundToken = await Token
    .where({user_id: user.get('id'), value: token, type: 'access'})
    .fetch()

  return foundToken != null
}
