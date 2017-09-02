import {bookshelf} from '../db'

const AppModel = bookshelf.Model.extend({
  serialize: function (options) {
    let result = bookshelf.Model.prototype.serialize.call(this, options)

    if (typeof result.created_at != 'undefined') {
      result.created_at = new Date(result.created_at)
    }

    if (typeof result.updated_at != 'undefined') {
      result.updated_at = new Date(result.updated_at)
    }

    return result
  }
})

export default AppModel
