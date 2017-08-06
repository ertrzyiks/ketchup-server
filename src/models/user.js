import {bookshelf} from '../db'
import {Room} from './room'

const User = bookshelf.Model.extend({
  tableName: 'users',
  tokens: function() {
    return this.hasMany(Token)
  },
  rooms: function() {
    return this.hasMany(Room)
  },
  hasTimestamps: true
})

export default User
