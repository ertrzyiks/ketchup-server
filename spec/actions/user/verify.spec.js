import test from 'ava'
import app from '../../specapp'
import {createUser, prepareDbFor} from '../../support'

prepareDbFor(app)

test.beforeEach(async () => {
  await createUser(app, {name: 'MyUser', accessToken: '123', refreshToken: '321'})
})

test('verify a user', async t => {
  const res = await app.perform('user.verify', {name: 'MyUser', accessToken: '123'})
  t.true(res)
})

test('verify a user using refresh token', async t => {
  const res = await app.perform('user.verify', {name: 'MyUser', accessToken: '321'})
  t.false(res)
})

test('verify a user using another wrong token', async t => {
  const res = await app.perform('user.verify', {name: 'MyUser', accessToken: 'XXX'})
  t.false(res)
})

test('verify a user using wrong name', async t => {
  const res = await app.perform('user.verify', {name: 'XXX', accessToken: '123'})
  t.false(res)
})
