
exports.up = function(knex, Promise) {
  if (knex.client.config.client != 'pg') {
    return Promise.resolve()
  }
  return knex.raw('create extension if not exists "uuid-ossp"')
}

exports.down = function(knex, Promise) {
  if (knex.client.config.client != 'pg') {
    return Promise.resolve()
  }

  return knex.raw('drop extension if exists "uuid-ossp"')
}
