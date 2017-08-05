import test from 'ava'
import sinon from 'sinon'
import knexCleaner from 'knex-cleaner'
import app from '../../specapp'

const sandbox = sinon.sandbox.create({useFakeTimers: true})

test.before(async () => {
  await app.db.knex.migrate.latest()
})

test.beforeEach(async () => {
  await knexCleaner.clean(app.db.knex)
})

test.afterEach(() => {
  sandbox.restore()
})

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
