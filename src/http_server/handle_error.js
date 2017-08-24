import AppError from '../errors/app_error'

const handleUnknownErrorDev = (err, req, res) => {
  console.error(err)

  res.status(500).send({
    error: 'InternalServerError',
    message: err.message,
    stack: err.stack
  })
}
const handleUnknownErrorProduction = (err, req, res) => {
  console.error(err)

  res.status(500).send({
    error: 'InternalServerError',
    message: 'Something went wrong'
  })
}

const handleUnknownError = process.env.NODE_ENV === 'production'
  ? handleUnknownErrorProduction
  : handleUnknownErrorDev

const handleApiError = (err, req, res) => {
  if (err instanceof AppError) {
    return res.status(401).send({
      error: err.name,
      message: err.message
    })
  }

  handleUnknownError(err, req, res)
}

export default handleApiError
