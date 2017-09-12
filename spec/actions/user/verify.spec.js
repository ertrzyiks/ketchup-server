import test from 'ava'
import {createUser, createSandbox, prepareDbFor} from '../../support'
import {verifyUser} from '../../app_actions'

const sandbox = createSandbox({useFakeTimers: true})
prepareDbFor()

let user

test.beforeEach(async () => {
  user = await createUser({name: 'MyUser', accessToken: '123', refreshToken: '321'})
})

test('verify a user', async t => {
  const res = await verifyUser({hash: user.hash, accessToken: '123'})
  t.true(res)
})

test('verify a user using refresh token', async t => {
  const res = await verifyUser({hash: user.hash, accessToken: '321'})
  t.false(res)
})

test('verify a user using another wrong token', async t => {
  const res = await verifyUser({hash: user.hash, accessToken: 'XXX'})
  t.false(res)
})

test('verify a user using expired token', async t => {
  const oneYear = 365 * 24 * 60 * 60 * 1000
  sandbox.clock.tick(oneYear)

  const res = await verifyUser({hash: user.hash, accessToken: '123'})
  t.false(res)
})

test('verify a user using wrong name', async t => {
  const res = await verifyUser({hash: '00000000-0000-0000-0000-000000000000', accessToken: '123'})
  t.false(res)
})
