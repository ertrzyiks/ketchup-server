import _knex from 'knex'
import _bookshelf from 'bookshelf'
import config from '../knexfile'

const ENV = process.env.NODE_ENV || 'development'
const knexInstance = _knex(config[ENV])

export var bookshelf = _bookshelf(knexInstance)
export var knex = knexInstance

export default {
  knex,
  bookshelf
}
