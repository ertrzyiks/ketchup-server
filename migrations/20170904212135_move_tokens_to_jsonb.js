
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.jsonb('tokens').notNull().default('[]')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.dropColumn('tokens')
  })
}
