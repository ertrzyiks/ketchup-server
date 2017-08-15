import test from 'ava'
import SpecServer from '../specserver'
import app from '../specapp'
import {createUser, prepareDbFor, LoguxTestUtils} from '../support'

prepareDbFor(app)

let server

test.afterEach(async () => {
  await server.destroy()
})

test(async t => {
  const reporter = LoguxTestUtils.createReporter(SpecServer)
  server = reporter.app

  const client = LoguxTestUtils.createClient(reporter.app)
  await client.connection.connect()

  await LoguxTestUtils.connect(client, '10:uuid', 'xxx')

  t.deepEqual(reporter.names, ['connect', 'unauthenticated', 'disconnect'])
})

test(async t => {
  const reporter = LoguxTestUtils.createReporter(SpecServer)
  server = reporter.app

  const client = LoguxTestUtils.createClient(reporter.app)
  await client.connection.connect()

  await createUser(app, {name: '10', accessToken: 'token'})

  await LoguxTestUtils.connect(client, '10:uuid', 'token')

  t.deepEqual(reporter.names, ['connect', 'authenticated'])
})
