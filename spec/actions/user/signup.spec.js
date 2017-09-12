import test from 'ava'
import {createSandbox, prepareDbFor} from '../../support'
import {signUp} from '../../app_actions'

const sandbox = createSandbox({useFakeTimers: true})
prepareDbFor()

test('create a user', async t => {
  sandbox.clock.tick(1000)
  const result = await signUp({name: 'MyUser'})
  const {user} = result

  t.is(user.name, 'MyUser')
  t.is(user.created_at.getTime(), new Date().getTime())
  t.is(user.updated_at.getTime(), new Date().getTime())
})

test('create tokens', async t => {
  const result = await signUp({name: 'MyUser'})
  const {accessToken, refreshToken} = result

  t.truthy(accessToken)
  t.truthy(refreshToken)
})
