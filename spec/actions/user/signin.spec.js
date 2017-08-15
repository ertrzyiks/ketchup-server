import test from 'ava'
import app from '../../specapp'
import {createUser, createSandbox, prepareDbFor} from '../../support'

const sandbox = createSandbox({useFakeTimers: true})

prepareDbFor(app)

test('login as a user', async t => {
  await createUser(app, {name: 'MyUser', accessToken: 'token', refreshToken: '123'})

  const result = await app.perform('user.signin', {name: 'MyUser', refreshToken: '123'})
  const {user} = result

  t.is(user.get('name'), 'MyUser')
})

test('retrieve new tokens', async t => {
  await createUser(app, {name: 'MyUser', accessToken: 'token', refreshToken: '123'})

  const result = await app.perform('user.signin', {name: 'MyUser', refreshToken: '123'})
  const {accessToken, refreshToken} = result

  t.truthy(accessToken)
  t.truthy(refreshToken)
})

test('rejects incorrect token', async t => {
  await createUser(app, {name: 'MyUser', accessToken: 'token', refreshToken: '123'})

  const result = await app.perform('user.signin', {name: 'MyUser', refreshToken: 'XXX'})

  t.falsy(result)
})

test('rejects expired token', async t => {
  await createUser(app, {name: 'MyUser', accessToken: 'token', refreshToken: '123'})

  const oneYear = 365 * 24 * 60 * 60 * 1000
  sandbox.clock.tick(oneYear)

  const result = await app.perform('user.signin', {name: 'MyUser', refreshToken: '123'})

  t.falsy(result)
})
