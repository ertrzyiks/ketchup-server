import {AppModel} from './app_model'
import {Room} from './room'

export const User = AppModel.extend({
  jsonFields: ['tokens'],
  tableName: 'users',
  hasTimestamps: true,

  rooms: function () {
    return this.belongsToMany(Room)
  },

  addToken: function (token) {
    const tokenJson = token.toJSON ? token.toJSON() : token
    return this.set('tokens', this.get('tokens').concat([tokenJson]))
  }
})
