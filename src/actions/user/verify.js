export default async (app, performer, data = {}) => {
  const {User, Token} = app.models
  const {name, token} = data

  const user = await User.where({name}).fetch()
  const foundToken = await Token
    .where({user_id: user.get('id'), value: token, type: 'access'})
    .fetch()

  return foundToken != null
}
