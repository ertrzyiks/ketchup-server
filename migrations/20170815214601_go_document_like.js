
exports.up = function(knex, Promise) {
  const dropUsersRooms = knex.schema.dropTable('users_rooms')

  const addRoomsColumn = knex.schema.table('rooms', function(t) {
    t.jsonb('users').notNull().default('[]');
  });

  const addUsersColumn = knex.schema.table('users', function(t) {
    t.jsonb('rooms').notNull().default('[]');
  });

  return Promise.all([
    addUsersColumn,
    addRoomsColumn,
    dropUsersRooms
  ])
};

exports.down = function(knex, Promise) {
  const createUsersRooms = knex.schema.createTable('users_rooms', function(table) {
    table.integer('user_id').references('users.id')
    table.integer('room_id').references('rooms.id')
    table.timestamps(true, true)
  });

  const dropRoomsColumn = knex.schema.table('rooms', function(t) {
    t.dropColumn('users');
  });

  const dropUsersColumn = knex.schema.table('users', function(t) {
    t.dropColumn('rooms');
  });

  return Promise.all([
    dropRoomsColumn,
    dropUsersColumn,
    createUsersRooms
  ])
};
