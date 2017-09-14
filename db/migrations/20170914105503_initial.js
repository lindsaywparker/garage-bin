
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('item', (table) => {
      table.increments('id').primary();
      table.string('name').unique();
      table.string('reason');
      table.string('cleanliness');
      
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('item'),
  ]);
};
