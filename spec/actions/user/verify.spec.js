import test from 'ava'
import app from '../../support/specapp'
import {createUser, createSandbox, prepareDbFor} from '../../support'

const sandbox = createSandbox({useFakeTimers: true})
prepareDbFor(app)

let user

test.beforeEach(async () => {
  user = await createUser(app, {name: 'MyUser', accessToken: '123', refreshToken: '321'})
})

test('verify a user', async t => {
  const res = await app.verifyUser({hash: user.hash, accessToken: '123'})
  t.true(res)
})

test('verify a user using refresh token', async t => {
  const res = await app.verifyUser({hash: user.hash, accessToken: '321'})
  t.false(res)
})

test('verify a user using another wrong token', async t => {
  const res = await app.verifyUser({hash: user.hash, accessToken: 'XXX'})
  t.false(res)
})

test('verify a user using expired token', async t => {
  const oneYear = 365 * 24 * 60 * 60 * 1000
  sandbox.clock.tick(oneYear)

  const res = await app.verifyUser({hash: user.hash, accessToken: '123'})
  t.false(res)
})

test('verify a user using wrong name', async t => {
  const res = await app.verifyUser({hash: '00000000-0000-0000-0000-000000000000', accessToken: '123'})
  t.false(res)
})
