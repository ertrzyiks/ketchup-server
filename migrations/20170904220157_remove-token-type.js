
exports.up = function(knex, Promise) {
  return knex.schema.table('tokens', function(t) {
    t.dropColumn('type')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('tokens', function(t) {
    t.string('type').notNullable().defaultsTo('refresh')
  })
};
