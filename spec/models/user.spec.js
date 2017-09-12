import test from 'ava'
import {User, Token} from '../app_models'

test(async t => {
  const token = await Token.forgeAccessToken()
  const user = User.forge({tokens: []})

  user.addToken(token)

  t.deepEqual(user.get('tokens'), [token.toJSON()])
})

test(async t => {
  const token = await Token.forgeAccessToken()
  const user = User.forge({tokens: []})

  user.addToken(token.toJSON())

  t.deepEqual(user.get('tokens'), [token.toJSON()])
})


test(async t => {
  const token1 = await Token.forgeAccessToken()
  const token2 = await Token.forgeAccessToken()
  const user = User.forge({tokens: [token1.toJSON()]})

  user.addToken(token2)

  t.deepEqual(user.get('tokens'), [token1.toJSON(), token2.toJSON()])
})
