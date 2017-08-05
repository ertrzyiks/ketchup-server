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

test('create a room', async t => {
  const performer = app.models.User.forge({id: 1})

  const room = await app.perform('room.create', performer, {roomName: '123'})

  t.is(room.get('name'), '123')
  t.is(room.get('owner_id'), 1)
  t.is(room.get('created_at').getTime(), new Date().getTime())
  t.is(room.get('updated_at').getTime(), new Date().getTime())
})

test('create a room without room name', async t => {
  const performer = app.models.User.forge({id: 1})

  const action = app.perform('room.create', performer)
  const error = await t.throws(action, Error);
  t.is(error.message, 'Room name can not be empty')
})
