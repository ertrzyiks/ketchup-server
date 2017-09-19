import {bookshelf} from '../db'

/**
 * @class AppModel
 * @memberof module:Models
 */
export const AppModel = bookshelf.Model.extend({
  jsonFields: [],

  serialize: function (options) {
    let result = bookshelf.Model.prototype.serialize.call(this, options)

    if (typeof result.created_at != 'undefined') {
      result.created_at = new Date(result.created_at)
    }

    if (typeof result.updated_at != 'undefined') {
      result.updated_at = new Date(result.updated_at)
    }

    return result
  },

  parse: function (attrs) {
    let res = Object.assign({}, bookshelf.Model.prototype.parse.call(this, attrs))

    this.jsonFields.forEach(field => {
      if (typeof res[field] == 'string') {
        res[field] = JSON.parse(res[field])
      }
    })
    return res
  },


  format: function (attrs) {
    let res = Object.assign({}, bookshelf.Model.prototype.format.call(this, attrs))

    this.jsonFields.forEach(field => {
      if (!res[field] || typeof res[field] == 'string') {
        return
      }

      res[field] = JSON.stringify(res[field])
    })

    return res
  }
}, {
  count: async function (column, options) {
    const count = await bookshelf.Model.count.call(this, column, options)
    return parseInt(count, 10)
  }
})
