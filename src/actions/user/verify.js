export default async (app, performer, data = {}) => {
  const {User, Token} = app.models
  const {name, token} = data

  // TODO: make a single query here
  const user = await User.where({name}).fetch()
  const userId = user ? user.get('id') : -1

  const foundToken = await Token
    .where('user_id', userId)
    .where('value', token)
    .where('type', 'access')
    .fetch()

  return foundToken != null
}
