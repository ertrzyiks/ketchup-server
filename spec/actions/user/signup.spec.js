import test from 'ava'
import app from '../../specapp'
import {createSandbox, prepareDbFor} from '../../support'

createSandbox({useFakeTimers: true})
prepareDbFor(app)

test('create a user', async t => {
  const user = await app.perform('user.signup', {name: 'MyUser'})

  t.is(user.get('name'), 'MyUser')
  t.is(user.get('created_at').getTime(), new Date().getTime())
  t.is(user.get('updated_at').getTime(), new Date().getTime())
})

test('create tokens', async t => {
  const Token = app.models.Token

  const user = await app.perform('user.signup', {name: 'MyUser'})

  const accessToken = await Token.where({user_id: user.get('id'), type: 'access'}).fetch()
  t.truthy(accessToken)

  const refreshToken = await Token.where({user_id: user.get('id'), type: 'refresh'}).fetch()
  t.truthy(refreshToken)
})
