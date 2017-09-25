import express from 'express'
import handleApiError from '../handle_error'
import {signIn} from '../../actions/user'

export default () => {
  const oauth = express()

  /**
   * OAuth endpoint. Allows to exchange refresh token on a new pair
   * of tokens.
   *
   * @memberof module:HTTP API
   * @name POST /v1/oauth/token
   * @path {POST} /v1/oauth/token
   *
   * @body {string} id Id of user
   * @body {string} refresh_token - Can be retrieved from sign up
   * @response {string} token_type - Always 'bearer'
   * @response {string} access_token - OAuth access token, used to authenticate
   * @response {number} expires_in - Time to access_token expire, in seconds
   * @response {string} refresh_token - OAuth refresh token, used to renew access token
   */
  oauth.post('/token', (req, res) => {
    signIn({
        hash: req.body.id,
        refreshToken: req.body.refresh_token,
      })
      .then(({accessToken, refreshToken}) => {
        res.send({
          token_type: 'bearer',
          access_token: accessToken.value,
          expires_in: accessToken.expires_in,
          refresh_token: refreshToken.value
        })
      })
      .catch(err => handleApiError(err, req, res))
  })

  return oauth
}
