import test from 'ava'
import app from '../../support/specapp'
import {createUser, createSandbox, prepareDbFor} from '../../support'

const sandbox = createSandbox({useFakeTimers: true})

prepareDbFor(app)

test('login as a user', async t => {
  const user = await createUser(app, {name: 'MyUser', accessToken: 'token', refreshToken: '123'})

  const result = await app.signIn({hash: user.hash, refreshToken: '123'})
  t.is(result.user.name, 'MyUser')
})

test('retrieve new tokens', async t => {
  const user = await createUser(app, {accessToken: 'token', refreshToken: '123'})

  const result = await app.signIn({hash: user.hash, refreshToken: '123'})
  const {accessToken, refreshToken} = result

  t.truthy(accessToken)
  t.truthy(refreshToken)
})

test('rejects incorrect token', async t => {
  const user = await createUser(app, {accessToken: 'token', refreshToken: '123'})

  const action = app.signIn({hash: user.hash, refreshToken: 'XXX'})

  const error = await t.throws(action, Error)
  t.is(error.message, 'Incorrect credentials')
})

test('rejects expired token', async t => {
  const oneYear = 365 * 24 * 60 * 60 * 1000

  const user = await createUser(app, {accessToken: 'token', refreshToken: '123'})
  sandbox.clock.tick(oneYear)

  const action = app.signIn({hash: user.hash, refreshToken: '123'})

  const error = await t.throws(action, Error)
  t.is(error.message, 'Incorrect credentials')
})
