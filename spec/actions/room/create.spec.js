import test from 'ava'
import app from '../../support/specapp'
import {createUser, createSandbox, prepareDbFor} from '../../support'

createSandbox({useFakeTimers: true})
prepareDbFor(app)

test('create a room', async t => {
  const performer = await createUser(app, {name: 'John Doe'})
  const room = await app.perform('room.create', performer, {roomName: '123'})

  t.is(room.get('name'), '123')
  t.is(room.get('owner_id'), performer.id)
  t.is(room.get('created_at').getTime(), new Date().getTime())
  t.is(room.get('updated_at').getTime(), new Date().getTime())
})

test('automatically join a created room', async t => {
  const performer = await createUser(app, {name: 'John Doe'})
  const room = await app.perform('room.create', performer, {roomName: '123'})

  t.is(room.get('users'), '[' + performer.id + ']')
  t.is(performer.get('rooms'), '[' + room.id + ']')
})

test('create a room without room name', async t => {
  const performer = app.models.User.forge({id: 1})

  const action = app.perform('room.create', performer)
  const error = await t.throws(action, Error);
  t.is(error.message, 'Room name can not be empty')
})
