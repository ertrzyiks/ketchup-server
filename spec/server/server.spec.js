import test from 'ava'
import {TestPair} from 'logux-sync'
import ServerClient from 'logux-server/server-client'
import knexCleaner from 'knex-cleaner'
import SpecServer from '../specserver'
import app from '../specapp'

let server

function createConnection () {
  const pair = new TestPair()
  pair.left.ws = {
    _socket: {
      remoteAddress: '127.0.0.1'
    }
  }
  return pair.left
}

function createServer (opts, reporter) {
  if (!opts) opts = { }
  opts.subprotocol = '0.0.1'
  opts.supports = '0.x'
  opts.reporter = reporter

  const server = new SpecServer(opts)
  server.log.on('preadd', (action, meta) => {
    meta.reasons.push('test')
  })

  return server
}

function createClient (app) {
  app.lastClient += 1
  const client = new ServerClient(app, createConnection(), app.lastClient)
  app.clients[app.lastClient] = client
  return client
}

function createReporter (opts) {
  const names = []
  const reports = []
  const app = createServer(opts, (name, details) => {
    names.push(name)
    reports.push([name, details])
  })
  return { app, reports, names }
}

async function connect(client, userId, token) {
  const protocol = client.sync.localProtocol

  client.connection.other().send([
    'connect', protocol, userId, 0, { credentials: token }
  ])
  await client.connection.pair.wait('right')
}

async function createUser(app, username, token) {
  const {Token} = app.models
  const user = await app.perform('user.signup', {name: username})
  const accessToken = await Token.where({ user_id: user.get('id'), type: 'access'}).fetch()
  return accessToken.set('value', token).save()
}

test.before(async () => {
  await app.db.knex.migrate.latest()
})

test.beforeEach(async () => {
  await knexCleaner.clean(app.db.knex)
})

test.afterEach(async () => {
  await server.destroy()
})

test(async t => {
  const reporter = createReporter()
  server = reporter.app

  const client = createClient(reporter.app)
  await client.connection.connect()

  await connect(client, '10:uuid', 'xxx')

  t.deepEqual(reporter.names, ['connect', 'unauthenticated', 'disconnect'])
})

test(async t => {
  const reporter = createReporter()
  server = reporter.app

  const client = createClient(reporter.app)
  await client.connection.connect()

  await createUser(app, '10', 'token')

  await connect(client, '10:uuid', 'token')

  t.deepEqual(reporter.names, ['connect', 'authenticated'])
})
