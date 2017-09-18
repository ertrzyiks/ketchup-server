import {AppModel} from './app_model'
import {User} from './user'

export const Room = AppModel.extend({
  tableName: 'rooms',
  hasTimestamps: true,

  users: function () {
    return this.belongsToMany(User)
  },

  owner: function() {
    return this.belongsTo(User, 'owner_id')
  }
})
