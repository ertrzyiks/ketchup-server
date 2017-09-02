import AppModel from './app_model'
import {knex} from '../db'

const User = AppModel.extend({
  tableName: 'users',
  hasTimestamps: true,

  parse: function (attrs) {
    let res = Object.assign({}, attrs)

    if (typeof res.rooms == 'string') {
      res.rooms = JSON.parse(res.rooms)
    }

    return res
  },

  format: function (attrs) {
    let res = Object.assign({}, attrs)

    if (typeof res.rooms != 'string' && typeof res.rooms != 'undefined') {
      res.rooms = JSON.stringify(res.rooms)
    }

    return res
  }
})

export default User
