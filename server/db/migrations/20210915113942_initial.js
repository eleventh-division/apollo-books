module.exports = require("knex-migrate-sql-file")()

// exports.up = function (knex) {
//   return Promise.all([
//     knex.schema.hasTable('genres').then(function(exists) {
//       if (!exists) {
//         return knex.schema.createTable('genres', function (table) {
//           table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
//
//           table.string('genre_name').notNullable();
//           table.unique(['id']);
//         })
//       }
//     }),
//     knex.schema.hasTable('authors').then(function(exists) {
//       if (!exists) {
//         return knex.schema.createTable('authors', function (table) {
//           table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
//
//           table.string('author_name').notNullable();
//           table.uuid('genre').notNullable();
//           table.foreign('genre').references('genres.id').onDelete('CASCADE');
//           table.unique(['id']);
//         })
//       }
//     }),
//     knex.schema.hasTable('books').then(function(exists) {
//       if (!exists) {
//         return knex.schema.createTable('books', function (table) {
//           table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
//
//           table.string('title').notNullable();
//           table.uuid('author').notNullable()
//           table.integer('year').notNullable();
//           table.uuid('genre').notNullable();
//           table.foreign('author').references('authors.id').onDelete('CASCADE');
//           table.foreign('genre').references('genres.id').onDelete('CASCADE');
//           table.unique(['id']);
//         })
//       }
//     }),
//   ]);
// };
//
// exports.down = function (knex) {
//   return Promise.all([
//     knex.schema.dropTableIfExists("books"),
//     knex.schema.dropTableIfExists("authors"),
//     knex.schema.dropTableIfExists("genres")
//   ]);
// };
