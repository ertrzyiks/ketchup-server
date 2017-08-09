import crypto from 'crypto'
import User from './user'
import {bookshelf} from '../db'

const generateToken = (size = 48) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size, function (err, buffer) {
      if (err) {
        return reject(err)
      }
      return resolve(buffer)
    })
  })
}

const Token = bookshelf.Model.extend({
  tableName: 'tokens',
  hasTimestamps: true,

  user: function() {
    return this.belongsTo(User)
  }
}, {
  forgeAccessTokenFor: async (user_id) => {
    return generateToken().then((value) => Token.forge({
      user_id: user_id,
      type: 'access',
      value,
      expire_at: new Date()
    }))
  },

  forgeRefreshTokenFor: async (user_id) => {
    return generateToken().then((value) => Token.forge({
      user_id: user_id,
      type: 'refresh',
      value: '123',
      expire_at: new Date()
    }))
  }
})

export default Token
