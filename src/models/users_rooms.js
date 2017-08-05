import {bookshelf} from '../db'
import Token from './token'

export const Room = bookshelf.Model.extend({
  tableName: 'rooms',
  users: function() {
    return this.hasMany(User)
  },
  hasTimestamps: true
})

export const User = bookshelf.Model.extend({
  tableName: 'users',
  tokens: function() {
    return this.hasMany(Token)
  },
  rooms: function() {
    return this.hasMany(Room)
  },
  hasTimestamps: true
})
