import AppModel from './app_model'

const Room = AppModel.extend({
  tableName: 'rooms',
  hasTimestamps: true
})

export default Room
