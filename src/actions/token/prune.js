import {Token} from '../../models'
import {knex} from '../../db'

/**
 * @returns {number} Number of removed tokens
 * @memberof module:Actions/Token
 */
async function pruneTokens() {
  return knex(Token.prototype.tableName).where('expire_at', '<', new Date()).del()
}

export {pruneTokens}
