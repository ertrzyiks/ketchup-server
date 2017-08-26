import express from 'express'
import handleApiError from '../handle_error'

export default (ketchapp) => {
  const users = express()

  users.post('/', (req, res) => {
    ketchapp
      .perform('user.signup', {
        name: 'user' + Math.floor(Math.random() * 10000)
      })
      .then(({user, accessToken, refreshToken}) =>{
        res.send({
          user: user.toJSON(),
          token: {
            token_type: 'bearer',
            access_token: accessToken.get('value'),
            expires_in: accessToken.getExpiresIn(),
            refresh_token: refreshToken.get('value')
          }
        })
      })
      .catch(err => handleApiError(err, req, res))
  })

  return users
}
