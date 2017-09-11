import test from 'ava'
import pick from 'lodash/pick'
import app from '../../support/specapp'
import {createUser, createSandbox, prepareDbFor} from '../../support'

createSandbox({useFakeTimers: true})
prepareDbFor(app)

test('create a room', async t => {
  const performer = await createUser(app, {name: 'John Doe'})
  const room = await app.createRoom(performer, {roomName: '123'})

  t.is(room.name, '123')
  t.is(room.owner_id, performer.id)
  t.is(room.created_at.getTime(), new Date().getTime())
  t.is(room.updated_at.getTime(), new Date().getTime())
})

test('automatically join a created room', async t => {
  const performer = await createUser(app, {name: 'John Doe'})
  const room = await app.createRoom(performer, {roomName: '123'})

  const user = await app.models.User.forge({id: performer.id}).fetch({withRelated: ['rooms']})

  t.deepEqual(room.users, [{
    id: performer.id,
    name: 'John Doe',
    hash: performer.hash,
    created_at: performer.created_at,
    updated_at: performer.updated_at
  }])

  const pickIdAndName = room => pick(room, ['id', 'name'])
  
  t.deepEqual(user.toJSON().rooms.map(pickIdAndName), [{
    id: room.id,
    name: '123'
  }])
})

test('create a room without room name', async t => {
  const performer = app.models.User.forge({id: 1})

  const action = app.createRoom(performer)
  const error = await t.throws(action, Error);
  t.is(error.message, 'Room name can not be empty')
})
