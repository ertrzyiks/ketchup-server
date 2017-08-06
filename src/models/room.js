import {bookshelf} from '../db'
import {User} from './user'

const Room = bookshelf.Model.extend({
  tableName: 'rooms',
  users: function() {
    return this.hasMany(User)
  },
  hasTimestamps: true
})

export default Room
