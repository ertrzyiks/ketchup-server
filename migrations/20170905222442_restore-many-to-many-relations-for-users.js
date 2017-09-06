
exports.up = function(knex, Promise) {
  return knex.schema.createTable('rooms_users', function(table) {
    table.integer('user_id').references('users.id')
    table.integer('room_id').references('rooms.id')
    table.timestamps(true, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('rooms_users')
};
