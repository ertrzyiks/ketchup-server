
exports.up = function(knex, Promise) {
  const dropRoomsColumn = knex.schema.table('rooms', function(t) {
    t.dropColumn('users')
  })

  const dropUsersColumn = knex.schema.table('users', function(t) {
    t.dropColumn('rooms')
  })

  return Promise.resolve()
    .then(() => dropRoomsColumn)
    .then(() => dropUsersColumn)
};

exports.down = function(knex, Promise) {
  const addRoomsColumn = knex.schema.table('rooms', function(t) {
    t.jsonb('users').notNull().default('[]')
  })

  const addUsersColumn = knex.schema.table('users', function(t) {
    t.jsonb('rooms').notNull().default('[]')
  })

  return Promise.all([
    addRoomsColumn,
    addUsersColumn
  ])
};
