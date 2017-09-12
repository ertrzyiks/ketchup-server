import express from 'express'
import {generateUsername} from 'username-generator'
import handleApiError from '../handle_error'
import {signUp} from '../../actions/user'

export default () => {
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
