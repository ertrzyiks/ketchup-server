import {bookshelf} from '../db'

const Room = bookshelf.Model.extend({
  tableName: 'rooms',
  hasTimestamps: true
})

export default Room
