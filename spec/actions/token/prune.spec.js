import test from 'ava'
import app from '../../support/specapp'
import {createUser, createSandbox, prepareDbFor} from '../../support'

const sandbox = createSandbox({useFakeTimers: true})

prepareDbFor(app)

let originalTokenLifeTime

test.beforeEach(() => {
  const {Token} = app.models
  originalTokenLifeTime = Token.refreshTokenLifeTime
  Token.refreshTokenLifeTime = 3 * 1000
})

test.afterEach(() => {
  const {Token} = app.models
  Token.refreshTokenLifeTime = originalTokenLifeTime
})

test('remove all expired tokens', async t => {
  const {Token} = app.models
  await createUser(app, {name: 'MyUser', accessToken: 'token', refreshToken: '123'})
  sandbox.clock.tick(2 * 1000)

  await createUser(app, {name: 'MyUser', accessToken: 'token', refreshToken: '123'})

  let affectedRows

  affectedRows = await app.perform('token.prune')
  t.is(affectedRows, 0)
  t.is(await Token.count(), 2)

  sandbox.clock.tick(2 * 1000)
  affectedRows = await app.perform('token.prune')
  t.is(affectedRows, 1)
  t.is(await Token.count(), 1)

  sandbox.clock.tick(2 * 1000)
  affectedRows = await app.perform('token.prune')
  t.is(affectedRows, 1)
  t.is(await Token.count(), 0)
})
