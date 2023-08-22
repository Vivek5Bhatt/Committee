const admin = require("firebase-admin");
const moment = require('moment/moment');
const axios = require('axios');
const serviceAccount = require("../serviceAccountKeys.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

const getUsers = async () => {
  const userRef = db.collection("Users");
  let userData = []
  await userRef.get().then((userSnapshot) => {
    userSnapshot.forEach(userDoc => {
      userData.push({ docId: userDoc.id, ...userDoc.data() })
    })
  })
  return userData
}

const getCommittees = async () => {
  const committeeRef = db.collection("Committee");
  let committeeData = []
  await committeeRef.get().then((committeeSnapshot) => {
    committeeSnapshot.forEach(committeeDoc => {
      committeeData.push({ docId: committeeDoc.id, ...committeeDoc.data() })
    })
  })
  return committeeData
}

const getCommitteeMembers = async () => {
  const committeeMemberRef = db.collection("Committee_Members");
  let committeeMemberData = []
  await committeeMemberRef.get().then((committeeMemberSnapshot) => {
    committeeMemberSnapshot.forEach(committeeMemberDoc => {
      committeeMemberData.push({ docId: committeeMemberDoc.id, ...committeeMemberDoc.data() })
    })
  })
  return committeeMemberData
}

const calculateDayDifference = (createdAt) => {
  const currentDate = moment().toDate().getTime()
  const differnceDay = Math.floor((currentDate - createdAt) / 1000 / 60 / 60 / 24)
  return differnceDay
}

const calculateDayToHours = (days) => {
  return days * 24 * 60 * 60 * 1000
}

const calculateCollectionDateTime = (collectionDate, nextPayoutDate) => {
  const collectionDays = collectionDate === '1 Week' ? 7 : collectionDate === '3 Weeks' ? 21 : 0
  const collectionDateHours = calculateDayToHours(collectionDays)
  const payOutDateFormat = moment(moment(nextPayoutDate, 'DD-MM-YYYY')).format('MM-DD-YYYY')
  const payOutDateTime = moment(payOutDateFormat).toDate().getTime()
  const collectionDateTime = payOutDateTime - collectionDateHours
  const todayTimestamp = moment().toDate().getTime()
  return todayTimestamp < collectionDateTime
}

const sendNotification = async (data) => {
  const userData = await getUsers()
  const admin = userData.find(user => user.role === "Admin")
  const notificatioRef = db.collection("Notifications");
  const notificationData = {
    body: data.message,
    committee_id: data.committee_id,
    timestamp: new Date().getTime(),
    uid: [data.uid],
    deletedFor: [],
    isSwipeToDeleteActive: false,
    title: data.title,
    type: data.type,
    sendBy: admin.docId,
  }
  await notificatioRef.add(notificationData)
  await axios.post("https://fcm.googleapis.com/fcm/send",
    {
      "to": data.user.device_token,
      "notification": {
        "body": data.message,
        "title": data.title
      }
    }, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': process.env.AUTHORIZATION_KEY
    }
  })
}

const paymentNotification = async () => {
  const committeeMemberData = await getCommitteeMembers()
  const committeeData = await getCommittees()
  const userData = await getUsers()
  const pendingPaymentUser = committeeMemberData.filter(committeeMember => {
    if (committeeMember.invite_status === "Accept" && committeeMember.payment_status === "Unpaid") {
      let findUserData
      const findCommitteeData = committeeData.find(committee => {
        if (committeeMember.committee_id === committee.docId && committee.collectionDate) {
          findUserData = userData.find(user => user.docId === committeeMember.uid)
          return ((committee.firstPayOutDate === committee.nextPayoutDate && calculateDayDifference(committee.timestamp) > 2) || (committee.firstPayOutDate !== committee.nextPayoutDate && calculateDayDifference(moment(committee.nextPayoutDate, "DD/MM/YYYY").toDate().getTime()) > 2)) && calculateCollectionDateTime(committee.collectionDate, committee.nextPayoutDate)
        }
      })
      if (findCommitteeData) {
        committeeMember.committee = findCommitteeData
        committeeMember.user = findUserData
        committeeMember.message = `Collection date is ${findCommitteeData.collectionDate} prior to payout date.`
        committeeMember.title = "Payment pending"
        committeeMember.type = "paymentRemainder"
        sendNotification(committeeMember)
        return committeeMember
      }
    }
  })
  return pendingPaymentUser
}

const inviteNotification = async () => {
  const committeeMemberData = await getCommitteeMembers()
  const committeeData = await getCommittees()
  const userData = await getUsers()
  const pendingCommitteeMembers = committeeMemberData.filter(committeeMember => {
    if (committeeMember.invite_status === "Pending" && calculateDayDifference(committeeMember.created_at) > 3) {
      const findCommitteeData = committeeData.find(committee => committee.docId === committeeMember.committee_id)
      const findUserData = userData.find(user => user.docId === committeeMember.uid)
      const findInviteUserData = userData.find(user => user.docId === committeeMember.invited_by)
      committeeMember.committee = findCommitteeData
      committeeMember.user = findUserData
      committeeMember.inviteUser = findInviteUserData
      committeeMember.message = `${findInviteUserData?.name} has invited you to join '${findCommitteeData?.title}'`
      committeeMember.title = "Invite pending"
      committeeMember.type = "comInviteRemainder"
      sendNotification(committeeMember)
      return committeeMember
    }
  })
  return pendingCommitteeMembers
}

module.exports = {
  paymentNotification,
  inviteNotification
}