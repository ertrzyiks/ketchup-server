import express from 'express'
import bodyParser from 'body-parser'
import oauth from './oauth'
import users from './users'

export default (ketchapp) => {
  const v1 = express()
  v1.use(bodyParser.urlencoded({ extended: false }))
  v1.use(bodyParser.json())

  v1.use('/oauth', oauth(ketchapp))
  v1.use('/users', users(ketchapp))
  return v1
}
