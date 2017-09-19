import crypto from 'crypto'
import bcrypt from 'bcrypt'
import {User} from './user'
import {AppModel} from './app_model'

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

/**
 * @class Token
 * @memberof module:Models
 */
export const Token = AppModel.extend({
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

  /**
   * @memberof module:Models.Token.prototype
   * @function
   * @return {Object}
   */
  toOutputJSON: function (value) {
    return Object.assign({}, this.toJSON(), {value})
  }
}, {
  accessTokenLifeTime: 15 * 60 * 1000,
  refreshTokenLifeTime: 60 * 24 * 60 * 60 * 1000,

  /**
   * @memberof module:Models.Token
   * @async
   * @static
   * @function
   * @return {Object}
   */
  forgeAccessToken: async () => {
    const value = await generateToken()

    return Token.forge({
      value,
      expire_at: new Date(Date.now() + Token.accessTokenLifeTime)
    })
  },

  /**
   * @memberof module:Models.Token
   * @async
   * @static
   * @function
   * @return {Object}
   */
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

  /**
   * @memberof module:Models.Token
   * @async
   * @static
   * @param {String} rawToken
   * @returns {String}
   */
  encrypt: (rawToken) => bcrypt.hash(rawToken, BCRYPT_COST),

  /**
   * @memberof module:Models.Token
   * @async
   * @static
   * @param {String} rawToken
   * @param {String} hash
   * @returns {String}
   */
  compare: (rawToken, hash) => bcrypt.compare(rawToken, hash)
})
