import test from 'ava'
import sinon from 'sinon'
import app from '../../specapp'

const sandbox = sinon.sandbox.create({useFakeTimers: true})

test.before(async () => {
  await app.db.knex.migrate.latest()
})

test.afterEach(() => {
  sandbox.restore()
})

test('verify a user', async t => {
  const {Token} = app.models
  const user = await app.perform('user.signup', {name: 'MyUser'})
  const accessToken = await Token.where({user_id: user.get('id'), type: 'access'}).fetch()

  const res = await app.perform('user.verify', {name: 'MyUser', token: accessToken.get('value')})
  t.true(res)
})

