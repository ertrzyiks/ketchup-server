import express from 'express'
import {generateUsername} from 'username-generator'
import handleApiError from '../handle_error'

export default (ketchapp) => {
  const users = express()

  users.post('/', (req, res) => {
    const name = generateUsername('-')

    ketchapp
      .perform('user.signup', {name})
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
