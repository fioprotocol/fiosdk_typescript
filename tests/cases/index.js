const { generalTests } = require('./general')
const { fioRequest } = require('./fio-request')
const { cancelRequest } = require('./cancel-request')
const { rejectRequest } = require('./reject-request')
const { transfer } = require('./transfer')
const { recordObt } = require('./record-obt')
const { encryptDecrypt } = require('./encrypt-decrypt')

module.exports = {
  generalTests,
  fioRequest,
  cancelRequest,
  rejectRequest,
  transfer,
  recordObt,
  encryptDecrypt,
}
