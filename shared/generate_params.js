const MD5 = require("crypto-js/md5");
const queryString = require('query-string');
const PURCHASE = require('./param_sets').purchase;
const moment = require('moment');

const calculateRCSignature = (data, secretKey) => {
  const sortedKeys = Object.keys(data).sort((a, b) => {
    if (a < b) return -1;
    else if (a > b) return 1;
    return 0;
  })

  const initialValue = `${secretKey}`

  const sortedQueries = sortedKeys.reduce((total, currentValue) => {
    return total + `${currentValue}=${data[currentValue]}`
  }, initialValue)

  return MD5(sortedQueries)
}

module.exports = (z, bundle, userData = {}) => {
  const accessID = process.env.ACCESS_ID || bundle.authData.access_id
  const secretKey = process.env.SECRET_KEY || bundle.authData.secret_key
  const epochNow = moment().unix()

  const defaultData = {
    accessID: accessID,
    timestamp: epochNow
  }

  let completeData = Object.assign(defaultData, userData)
  completeData.signature = calculateRCSignature(completeData, secretKey)

  return queryString.stringify(completeData)
}
