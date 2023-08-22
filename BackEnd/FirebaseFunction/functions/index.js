require('dotenv').config()
const { pubsub } = require("firebase-functions");
const { inviteNotification, paymentNotification } = require("./notification")

exports.notificationEveryDay = pubsub.schedule("30 21 * * *").onRun(async () => {
  await inviteNotification()
  await paymentNotification()
})
