import test from 'ava'
import {createUser, createSandbox, prepareDbFor} from '../../support'
import {signIn} from '../../app_actions'

const sandbox = createSandbox({useFakeTimers: true})

prepareDbFor()

test('login as a user', async t => {
  const user = await createUser({name: 'MyUser', accessToken: 'token', refreshToken: '123'})

  const result = await signIn({hash: user.hash, refreshToken: '123'})
  t.is(result.user.name, 'MyUser')
})

test('retrieve new tokens', async t => {
  const user = await createUser({accessToken: 'token', refreshToken: '123'})

  const result = await signIn({hash: user.hash, refreshToken: '123'})
  const {accessToken, refreshToken} = result

  t.truthy(accessToken)
  t.truthy(refreshToken)
})

test('rejects incorrect token', async t => {
  const user = await createUser({accessToken: 'token', refreshToken: '123'})

  const action = signIn({hash: user.hash, refreshToken: 'XXX'})

  const error = await t.throws(action, Error)
  t.is(error.message, 'Incorrect credentials')
})

test('rejects expired token', async t => {
  const oneYear = 365 * 24 * 60 * 60 * 1000

  const user = await createUser({accessToken: 'token', refreshToken: '123'})
  sandbox.clock.tick(oneYear)

  const action = signIn({hash: user.hash, refreshToken: '123'})

  const error = await t.throws(action, Error)
  t.is(error.message, 'Incorrect credentials')
})
