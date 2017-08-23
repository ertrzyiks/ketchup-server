
exports.up = function(knex, Promise) {
  const createUsers = knex.schema.createTable('users', function (table) {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.timestamps(true, true)
    table.unique('name')
  })

  const createRooms = knex.schema.createTable('rooms', function (table) {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.integer('owner_id').references('users.id').notNullable()
    table.timestamps(true, true)
  })

  const createUsersRooms = knex.schema.createTable('users_rooms', function(table) {
    table.increments('id').primary()
    table.integer('user_id').references('users.id')
    table.integer('room_id').references('rooms.id')
    table.timestamps(true, true)
  });

  const createTokens = knex.schema.createTable('tokens', function(table) {
    table.increments('id').primary()
    table.integer('user_id').references('users.id').notNullable()
    table.string('value').notNullable()
    table.string('type').notNullable()
    table.timestamp('expire_at').notNullable()
    table.timestamps(true, true)
  });

  return Promise.all([
    createUsers,
    createRooms,
    createUsersRooms,
    createTokens
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users_rooms'),
    knex.schema.dropTable('users'),
    knex.schema.dropTable('tokens'),
    knex.schema.dropTable('rooms')
  ])
};
