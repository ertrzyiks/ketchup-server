import ServerClient from 'logux-server/server-client'
import {TestPair} from 'logux-sync'

export function createConnection () {
  const pair = new TestPair()
  pair.left.ws = {
    _socket: {
      remoteAddress: '127.0.0.1'
    }
  }
  return pair.left
}

export function createServer (serverFactory, opts, reporter) {
  if (!opts) opts = { }
  opts.subprotocol = '0.0.1'
  opts.supports = '0.x'
  opts.reporter = reporter

  const server = serverFactory(opts)
  server.log.on('preadd', (action, meta) => {
    meta.reasons.push('test')
  })

  return server
}

export function createClient (app) {
  app.lastClient += 1
  const client = new ServerClient(app, createConnection(), app.lastClient)
  app.clients[app.lastClient] = client
  return client
}

export function createReporter (serverFactory, opts) {
  const names = []
  const reports = []
  const app = createServer(serverFactory, opts, (name, details) => {
    names.push(name)
    reports.push([name, details])
  })
  return { app, reports, names }
}

export async function connect(client, userId, token) {
  const protocol = client.sync.localProtocol

  client.connection.other().send([
    'connect', protocol, userId, 0, { credentials: token }
  ])
  await client.connection.pair.wait('right')
}
