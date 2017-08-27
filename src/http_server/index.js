import express from 'express'
import cors from 'cors'
import v1 from './v1'

export default (ketchapp) => {
  const httpServer = express()

  httpServer.use(cors({
    origin: [
      'http://localhost:3000',
      process.env.WEB_URL
    ],
    optionsSuccessStatus: 200
  }))

  httpServer.use('/v1', v1(ketchapp))

  httpServer.get('/status', (req, res) => {
    res.send({
      status: 'ok'
    })
  })

  return httpServer
}
