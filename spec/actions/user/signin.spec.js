import test from 'ava'
import app from '../../specapp'
import {createUser, prepareDbFor} from '../../support'

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
