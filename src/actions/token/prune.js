
export default async (app, performer, data = {}) => {
  const {Token} = app.models
  const {knex} = app.db

  return knex(Token.prototype.tableName).where('expire_at', '<', new Date()).del()
}
