module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/garage_bin',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
    },
  },

  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/garage_bin_test',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/test/seeds',
    },
  },

  production: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
    },
  },
};
