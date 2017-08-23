import crypto from 'crypto'
import User from './user'
import {bookshelf} from '../db'

const generateToken = (size = 48) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size, function (err, buffer) {
      if (err) {
        return reject(err)
      }
      return resolve(buffer.toString('hex'))
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
  accessTokenLifeTime: 15 * 60 * 1000,
  refreshTokenLifeTime: 60 * 24 * 60 * 60 * 1000,

  forgeAccessTokenFor: async (user_id) => {
    return generateToken().then((value) => Token.forge({
      user_id: user_id,
      type: 'access',
      value,
      expire_at: new Date(Date.now() + Token.accessTokenLifeTime)
    }))
  },

  forgeRefreshTokenFor: async (user_id) => {
    return generateToken().then((value) => Token.forge({
      user_id: user_id,
      type: 'refresh',
      value,
      expire_at: new Date(Date.now() + Token.refreshTokenLifeTime)
    }))
  }
})

export default Token
