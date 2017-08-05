import objectPath from 'object-path'
import db from './db'

export default ({models, actions}) => {
  var _cache = {}
  var app = {}

  app.models = models
  app.db = db
  app.perform = (actionName, performer, data) => {
    if (!_cache[actionName]) {
      _cache[actionName] = objectPath.get(actions, actionName)
    }

    const actionFn = _cache[actionName]
    return actionFn(app, performer, data)
  }

  return app
}
