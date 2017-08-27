import actions from './actions'
import models from './models'
import getKetchApp from './app'
import KetchupServer from './server'
import getHttpServer from './http_server'

const ketchapp = getKetchApp({actions, models})
const httpServer = getHttpServer(ketchapp)

const listener = httpServer.listen(process.env.PORT || 3000, function () {
  const app = new KetchupServer(ketchapp, KetchupServer.loadOptions(process, {
    server: listener,
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname
  }))

  app.reporter.logger.info(listener.address(), 'Custom HTTP Server is listening')
  app.listen()
})
