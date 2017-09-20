import express from 'express'
import handleApiError from '../handle_error'
import {signIn} from '../../actions/user'

export default () => {
  const oauth = express()

  /**
   * OAuth endpoint. Allows to exchange refresh token on new tokens
   * pair.
   *
   * @memberof module:HTTP API
   * @name POST /v1/oauth/token
   * @path {POST} /v1/oauth/token
   *
   * @body {String} [id] Id of user
   * @body {String} [refresh_token] Can be retrieved from sign up
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
