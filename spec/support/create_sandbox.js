import test from 'ava'
import sinon from 'sinon'

export function createSandbox (options = {}) {
  const sandbox = sinon.sandbox.create(options)
  test.afterEach(() => sandbox.restore())
  return sandbox
}
