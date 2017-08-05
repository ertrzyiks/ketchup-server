import {bookshelf} from '../db'

const Token = bookshelf.Model.extend({
  tableName: 'tokens',
  hasTimestamps: true
}, {
  forgeAccessTokenFor: (user_id) => {
    return Token.forge({
      user_id: user_id,
      type: 'access',
      value: '123',
      expire_at: new Date()
    })
  },

  forgeRefreshTokenFor: (user_id) => {
    return Token.forge({
      user_id: user_id,
      type: 'refresh',
      value: '123',
      expire_at: new Date()
    })
  }
})

export default Token
