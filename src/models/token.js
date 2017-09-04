import crypto from 'crypto'
import User from './user'
import AppModel from './app_model'

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

const Token = AppModel.extend({
  tableName: 'tokens',
  hasTimestamps: true,

  user: function() {
    return this.belongsTo(User)
  },

  toJSON: function (...args) {
    let res = AppModel.prototype.toJSON.call(this, ...args)

    res.expires_in = 10

    return res
  }
}, {
  accessTokenLifeTime: 15 * 60 * 1000,
  refreshTokenLifeTime: 60 * 24 * 60 * 60 * 1000,

  forgeAccessToken: async () => {
    return generateToken().then((value) => Token.forge({
      value,
      expire_at: new Date(Date.now() + Token.accessTokenLifeTime)
    }))
  },

  forgeRefreshTokenFor: async (user_id) => {
    return generateToken().then((value) => Token.forge({
      user_id: user_id,
      value,
      expire_at: new Date(Date.now() + Token.refreshTokenLifeTime)
    }))
  }
})

export default Token
