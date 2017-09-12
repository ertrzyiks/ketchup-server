import express from 'express'
import handleApiError from '../handle_error'

export default (ketchapp) => {
  const oauth = express()

  oauth.post('/token', (req, res) => {
    ketchapp
      .signIn({
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
