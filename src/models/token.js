import crypto from 'crypto'
import bcrypt from 'bcrypt'
import User from './user'
import AppModel from './app_model'

const BCRYPT_COST = (process.env.NODE_ENV === 'test') ? 1 : 15

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
  },

  toOutputJSON: function (value) {
    return Object.assign({}, this.toJSON(), {value})
  }
}, {
  accessTokenLifeTime: 15 * 60 * 1000,
  refreshTokenLifeTime: 60 * 24 * 60 * 60 * 1000,

  forgeAccessToken: async () => {
    const value = await generateToken()

    return Token.forge({
      value,
      expire_at: new Date(Date.now() + Token.accessTokenLifeTime)
    })
  },

  forgeRefreshTokenFor: async (user_id) => {
    const rawValue = await generateToken()
    const value = await Token.encrypt(rawValue)

    return {
      refreshToken: Token.forge({
        user_id: user_id,
        value,
        expire_at: new Date(Date.now() + Token.refreshTokenLifeTime)
      }),
      rawValue
    }
  },

  encrypt: (rawToken) => bcrypt.hash(rawToken, BCRYPT_COST),
  compare: (rawToken, hash) => bcrypt.compare(rawToken, hash)
})

export default Token
