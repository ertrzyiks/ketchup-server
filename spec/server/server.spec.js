import test from 'ava'
import SpecServer from '../support/specserver'
import {createUser, prepareDbFor, LoguxTestUtils} from '../support'

const serverFactory = opts => new SpecServer(opts)

prepareDbFor()

let server

test.afterEach(async () => {
  await server.destroy()
})

test(async t => {
  const reporter = LoguxTestUtils.createReporter(serverFactory)
  server = reporter.app

  const client = LoguxTestUtils.createClient(reporter.app)
  await client.connection.connect()

  const user = await createUser({name: '10', accessToken: 'token'})

  await LoguxTestUtils.connect(client,  user.hash + ':uuid', 'xxx')

  t.deepEqual(reporter.names, ['connect', 'unauthenticated', 'disconnect'])
})

test(async t => {
  const reporter = LoguxTestUtils.createReporter(serverFactory)
  server = reporter.app

  const client = LoguxTestUtils.createClient(reporter.app)
  await client.connection.connect()

  const user = await createUser({name: '10', accessToken: 'token'})

  await LoguxTestUtils.connect(client, user.hash + ':uuid', 'token')

  t.deepEqual(reporter.names, ['connect', 'authenticated'])
})
