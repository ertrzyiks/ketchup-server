import {AppModel} from './app_model'
import {Room} from './room'

/**
 * @class User
 * @memberof module:Models
 */
export const User = AppModel.extend({
  jsonFields: ['tokens'],
  tableName: 'users',
  hasTimestamps: true,

  rooms: function () {
    return this.belongsToMany(Room)
  },

  /**
   * @memberof module:Models.User.prototype
   * @function
   * @return {Object}
   */
  addToken: function (token) {
    const tokenJson = token.toJSON ? token.toJSON() : token
    return this.set('tokens', this.get('tokens').concat([tokenJson]))
  }
})
