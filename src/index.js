import KetchupServer from './server'
import getHttpServer from './http_server'
import {pruneTokens} from './actions/token'
const httpServer = getHttpServer()

const HOUR = 60 * 60 * 1000

const listener = httpServer.listen(process.env.PORT || 3001, function () {
  const app = new KetchupServer(KetchupServer.loadOptions(process, {
    server: listener,
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname
  }))

  setInterval(async () => {
    const affected = await pruneTokens().then()
    app.reporter.logger.info({affected}, 'Pruning refresh tokens')
  }, HOUR)

  app.reporter.logger.info(listener.address(), 'Custom HTTP Server is listening')
  app.listen()
})
