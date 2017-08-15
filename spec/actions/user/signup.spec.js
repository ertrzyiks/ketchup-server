import test from 'ava'
import app from '../../support/specapp'
import {createSandbox, prepareDbFor} from '../../support'

createSandbox({useFakeTimers: true})
prepareDbFor(app)

test('create a user', async t => {
  const result = await app.perform('user.signup', {name: 'MyUser'})
  const {user} = result

  t.is(user.get('name'), 'MyUser')
  t.is(user.get('created_at').getTime(), new Date().getTime())
  t.is(user.get('updated_at').getTime(), new Date().getTime())
})

test('create tokens', async t => {
  const result = await app.perform('user.signup', {name: 'MyUser'})
  const {accessToken, refreshToken} = result

  t.truthy(accessToken)
  t.truthy(refreshToken)
})

test('create a user with duplicated name', async t => {
  await app.perform('user.signup', {name: 'MyUser'})
  const action = app.perform('user.signup', {name: 'MyUser'})

  const error = await t.throws(action, Error);
  t.is(error.message, 'Username is already taken')
})
