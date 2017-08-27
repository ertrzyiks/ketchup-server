import express from 'express'
import v1 from './v1'

export default (ketchapp) => {
  const httpServer = express()
  httpServer.use('/v1', v1(ketchapp))

  httpServer.get('/status', (req, res) => {
    res.send({
      status: 'ok'
    })
  })

  return httpServer
}
