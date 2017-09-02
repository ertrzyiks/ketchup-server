import AppModel from './app_model'

const User = AppModel.extend({
  jsonFields: ['rooms'],
  tableName: 'users',
  hasTimestamps: true
})

export default User
