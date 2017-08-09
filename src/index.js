import KetchupServer from './server'

const app = new KetchupServer(
  KetchupServer.loadOptions(process, {
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname
  })
)

app.listen()
