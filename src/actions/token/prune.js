import {Token} from '../../models'
import {knex} from '../../db'

async function pruneTokens() {
  return knex(Token.prototype.tableName).where('expire_at', '<', new Date()).del()
}

export {pruneTokens}
