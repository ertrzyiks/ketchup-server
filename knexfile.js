module.exports = {
  test: {
    client: 'sqlite',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true
  },
  development: {
    client: 'sqlite',
    connection: {
      filename: './data/db.sqlite'
    },
    useNullAsDefault: true
  },
  production: { client: 'pg', connection: process.env.DATABASE_URL }
}
