import test from 'ava'
import sinon from 'sinon'

export function createSandbox (options = {}) {
  const sandbox = sinon.sandbox.create(options)
  test.afterEach(() => sandbox.reset())
  test.after(() => sandbox.restore())
  return sandbox
}
