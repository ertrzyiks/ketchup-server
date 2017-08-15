import {bookshelf} from '../db'

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true
})

export default User
