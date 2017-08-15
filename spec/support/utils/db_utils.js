import test from 'ava'
import knexCleaner from 'knex-cleaner'

export function prepareDbFor(app) {
  test.before(async () => {
    await app.db.knex.migrate.latest()
  })

  test.beforeEach(async () => {
    await knexCleaner.clean(app.db.knex)
  })
}
