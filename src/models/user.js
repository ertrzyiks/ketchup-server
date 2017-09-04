import AppModel from './app_model'

const User = AppModel.extend({
  jsonFields: ['rooms', 'tokens'],
  tableName: 'users',
  hasTimestamps: true,

  addToken: function (token) {
    const tokenJson = token.toJSON ? token.toJSON() : token
    return this.set('tokens', this.get('tokens').concat([tokenJson]))
  }
})

export default User
