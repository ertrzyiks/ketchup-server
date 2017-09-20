import {getJsonNestedUser} from './user'

/**
 * @typedef {Object} Session
 * @property {module:JsonModels.NestedUser} user - Current user
 * @property {Object} accessToken
 * @property {Object} refreshToken
 * @memberof module:JsonModels
 */
const getJsonSession = (user, accessToken, refreshToken) => {
  return {
    user: getJsonNestedUser(user),
    accessToken: accessToken,
    refreshToken: refreshToken
  }
}


export {getJsonSession}
