import test from 'ava'
import {createUser, createSandbox, prepareDbFor} from '../../support'
import { findUserByHash } from '../../app_actions'

createSandbox({useFakeTimers: true})
prepareDbFor()

test('find user by hash', async t => {
  const user = await createUser({ name: 'John Doe' })
  const foundUser = await findUserByHash(user.hash)

  t.is(foundUser.name, user.name)
  t.is(foundUser.id, user.id)
  t.is(foundUser.hash, user.hash)
})

test('find user returns null if not found', async t => {
  const foundUser = await findUserByHash('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
  t.is(foundUser, null)
})
