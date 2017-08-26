import express from 'express'
import AuthenticationError from '../../errors/authentication_error'
import handleApiError from '../handle_error'

export default (ketchapp) => {
  const oauth = express()

  oauth.post('/token', (req, res) => {
    ketchapp
      .perform('user.signin', {
        name: req.body.name,
        refreshToken: req.body.refresh_token,
      })
      .then(({accessToken, refreshToken}) => {
        res.send({
          token_type: 'bearer',
          access_token: accessToken.get('value'),
          expires_in: accessToken.getExpiresIn(),
          refresh_token: refreshToken.get('value')
        })
      })
      .catch(err => handleApiError(err, req, res))
  })

  return oauth
}
