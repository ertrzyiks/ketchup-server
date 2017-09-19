import pick from 'lodash/pick'

/**
 * @typedef {Object} User
 * @property {String} id - Identifier
 * @property {String} name - User name
 * @property {String} hash - User name
 * @property {Date} created_at
 * @property {Date} updated_at
 * @memberof module:JsonModels
 */
const getJsonUser = (user) => {
  let jsonUser = pick(user, ['hash', 'name', 'created_at', 'updated_at'])
  jsonUser.id = jsonUser.hash
  delete jsonUser.hash
  return jsonUser
}

/**
 * @typedef {Object} NestedUser
 * @property {String} id - Identifier
 * @property {String} name - User name
 * @property {String} hash - User name
 * @property {Date} created_at
 * @property {Date} updated_at
 * @memberof module:JsonModels
 */
const getJsonNestedUser = (user) => {
  let jsonUser = pick(user, ['hash', 'name', 'created_at', 'updated_at'])
  jsonUser.id = jsonUser.hash
  delete jsonUser.hash
  return jsonUser
}

export {getJsonUser, getJsonNestedUser}
