import test from 'ava'
import {createUser, createSandbox, prepareDbFor} from '../../support'
import {Token} from '../../app_models'
import {pruneTokens} from '../../app_actions'

const sandbox = createSandbox({useFakeTimers: true})

prepareDbFor()

let originalTokenLifeTime

test.beforeEach(() => {
  originalTokenLifeTime = Token.refreshTokenLifeTime
  Token.refreshTokenLifeTime = 3 * 1000
})

test.afterEach(() => {
  Token.refreshTokenLifeTime = originalTokenLifeTime
})

test('remove all expired tokens', async t => {
  await createUser({name: 'MyUser', accessToken: 'token', refreshToken: '123'})
  sandbox.clock.tick(2 * 1000)

  await createUser({name: 'MyUser', accessToken: 'token', refreshToken: '123'})

  let affectedRows

  affectedRows = await pruneTokens()
  t.is(affectedRows, 0)
  t.is(await Token.count(), 2)

  sandbox.clock.tick(2 * 1000)
  affectedRows = await pruneTokens()
  t.is(affectedRows, 1)
  t.is(await Token.count(), 1)

  sandbox.clock.tick(2 * 1000)
  affectedRows = await pruneTokens()
  t.is(affectedRows, 1)
  t.is(await Token.count(), 0)
})
