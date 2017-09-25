import express from 'express'
import {generateUsername} from 'username-generator'
import handleApiError from '../handle_error'
import {signUp} from '../../actions/user'

export default () => {

  /**
   * Register new user.
   *
   * @memberof module:HTTP API
   * @name POST /v1/users
   * @path {POST} /v1/users
   *
   * @response {object} user
   * @response {string} user.id - User identifier
   * @response {string} user.name - User name
   * @response {string} user.updated_at - Date string of the last update
   * @response {string} user.created_at - Date string of the registration
   * @response {object} token
   * @response {string} token.token_type - Always 'bearer'
   * @response {string} token.access_token - OAuth access token, used to authenticate
   * @response {string} token.expires_in - Time to access_token expire, in seconds
   * @response {string} token.refresh_token - OAuth refresh token, used to renew access token
   */
  const users = express()
  users.post('/', (req, res) => {
    const name = generateUsername('-')

    signUp({name})
      .then(({user, accessToken, refreshToken}) =>{
        res.send({
          user: {
            name: user.name,
            updated_at: user.updated_at,
            created_at: user.created_at,
            id: user.hash
          },
          token: {
            token_type: 'bearer',
            access_token: accessToken.value,
            expires_in: accessToken.expires_in,
            refresh_token: refreshToken.value
          }
        })
      })
      .catch(err => handleApiError(err, req, res))
  })

  return users
}
