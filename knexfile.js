const usePostgresForTest = process.env.WITH_POSTGRES === 'true'
const testConfig = usePostgresForTest ?
  { client: 'pg', connection: process.env.DATABASE_URL } :
  {
    client: 'sqlite',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true
  }

module.exports = {
  test: testConfig,
  development: {
    client: 'sqlite',
    connection: {
      filename: './data/db.sqlite'
    },
    useNullAsDefault: true
  },
  production: { client: 'pg', connection: process.env.DATABASE_URL }
}
