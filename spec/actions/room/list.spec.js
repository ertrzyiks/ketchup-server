import test from 'ava'
import {createUser, createSandbox, prepareDbFor} from '../../support'
import { createRoom, listUserRooms } from '../../app_actions'

createSandbox({useFakeTimers: true})
prepareDbFor()

test('can list rooms for a user', async t => {
  const performer = await createUser({name: 'John Doe'})
  const room1 = await createRoom(performer, {roomName: '123'})
  const room2 = await createRoom(performer, {roomName: '456'})

  const userRooms = await listUserRooms(performer)
  t.is(userRooms.length, 2)
  t.not(userRooms.find(r => r.roomName === room1.roomName), undefined)
  t.not(userRooms.find(r => r.roomName === room2.roomName), undefined)

  userRooms.forEach(r => {
    t.is(r.owner_id, performer.hash)
  })
})

test('returns an empty list if there are no rooms', async t => {
  const performer = await createUser({name: 'John Doe'})

  const userRooms = await listUserRooms(performer)
  t.is(userRooms.length, 0)
})
