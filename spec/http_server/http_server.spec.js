import test from 'ava'
import request from 'request-promise-native'
import getHttpServer from '../../src/http_server'
import app from '../support/specapp'
import {createUser, createSandbox, prepareDbFor} from '../support'

const sandbox = createSandbox({useFakeTimers: true})

prepareDbFor(app)

let listener

test.beforeEach(async () => {
  await new Promise((resolve, reject) => {
    listener = getHttpServer(app).listen(0, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
})

test.afterEach(async () => {
  listener.close()
})

const doRequest = (method, relativeURL, body = {}) => {
  const {port} = listener.address()

  return request({
    method,
    uri: `http://localhost:${port}${relativeURL}`,
    body,
    json: true,
    resolveWithFullResponse: true,
    simple: false
  })
}

test('health check', async t => {
  const {body, statusCode} = await doRequest('GET', '/status')

  t.is(statusCode, 200)
  t.snapshot(body)
})

test('register a user', async t => {
  const {body, statusCode} = await doRequest('POST', '/v1/users')

  t.is(statusCode, 200)
  t.deepEqual(Object.keys(body), ['user', 'token'])
  t.deepEqual(Object.keys(body.user), ['name', 'updated_at', 'created_at', 'id'])
  t.deepEqual(Object.keys(body.token), ['token_type', 'access_token', 'expires_in', 'refresh_token'])

  let user = Object.assign({}, body.user)
  delete user.name
  delete user.id
  t.snapshot(user)
})

test('login with refresh_token', async t => {
  await createUser(app, {name: '10', refreshToken: 'my-refresh-token'})
  const {body, statusCode} = await doRequest('POST', '/v1/oauth/token', {name: '10', refresh_token: 'my-refresh-token'})

  t.is(statusCode, 200)
  t.deepEqual(Object.keys(body), ['token_type', 'access_token', 'expires_in', 'refresh_token'])
})

test('login with incorrect refresh_token', async t => {
  await createUser(app, {name: '10', refreshToken: 'my-refresh-token'})
  const {body, statusCode} = await doRequest('POST', '/v1/oauth/token', {name: '10', refresh_token: 'XXX'})

  t.is(statusCode, 401)
  t.snapshot(body)
})
