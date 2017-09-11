import db from './db'

export default ({models, actions}) => {
  let app = {}

  return Object.assign(app, wrapActions(app, actions), {
    models,
    db
  })
}

function wrapActions(app, rawActions) {
  let actions = {}

  Object.keys(rawActions).forEach(name => {
    actions[name] = wrapAction(app, rawActions[name])
  })

  return actions
}

function wrapAction(app, actionFn) {
  return function (performer, data) {
    if (!data) {
      data = performer
      performer = null
    }

    return actionFn.apply(app, [app, performer, data])
  }
}
