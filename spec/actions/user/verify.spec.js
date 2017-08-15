import test from 'ava'
import app from '../../specapp'
import {prepareDbFor} from '../../support'

prepareDbFor(app)

test('verify a user', async t => {
  const {Token} = app.models
  const user = await app.perform('user.signup', {name: 'MyUser'})
  const accessToken = await Token.where({user_id: user.get('id'), type: 'access'}).fetch()

  const res = await app.perform('user.verify', {name: 'MyUser', token: accessToken.get('value')})
  t.true(res)
})

test('verify a user using refresh token', async t => {
  const {Token} = app.models
  const user = await app.perform('user.signup', {name: 'MyUser'})
  const refreshToken = await Token.where({user_id: user.get('id'), type: 'refresh'}).fetch()

  const res = await app.perform('user.verify', {name: 'MyUser', token: refreshToken.get('value')})
  t.false(res)
})

test('verify a user using another wrong token', async t => {
  const {Token} = app.models
  const user = await app.perform('user.signup', {name: 'MyUser'})

  const res = await app.perform('user.verify', {name: 'MyUser', token: 'XXX'})
  t.false(res)
})

test('verify a user using wrong name', async t => {
  const res = await app.perform('user.verify', {name: 'MyUser', token: 'XXX'})
  t.false(res)
})
