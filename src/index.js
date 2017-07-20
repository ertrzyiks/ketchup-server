const Server = require('logux-server').Server

const app = new Server(
  Server.loadOptions(process, {
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname
  })
)

app.auth((userId, token) => {
    return Promise.resolve(true)
})

app.listen()
