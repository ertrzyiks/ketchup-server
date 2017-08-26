import actions from './actions'
import models from './models'
import getKetchApp from './app'
import KetchupServer from './server'
import getHttpServer from './http_server'

const ketchapp = getKetchApp({actions, models})
const httpServer = getHttpServer(ketchapp)

const app = new KetchupServer(ketchapp, KetchupServer.loadOptions(process, {
  server: httpServer,
  subprotocol: '1.0.0',
  supports: '1.x',
  root: __dirname
}))

const listener = httpServer.listen(process.env.PORT || 3000, function () {
  app.reporter.logger.info(listener.address(), 'Custom HTTP Server is listening')
  app.listen()
})
