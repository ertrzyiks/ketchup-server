import test from 'ava'
import knexCleaner from 'knex-cleaner'
import {knex} from '../../../src/db'

export function prepareDbFor() {
  test.beforeEach(async () => {
    await knex.migrate.latest()
  })

  test.beforeEach(async () => {
    await knexCleaner.clean(knex, {
      ignoreTables: ['knex_migrations', 'knex_migrations_lock']
    })
  })
}
