"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation'
import styles from '../../../../../style/dashboard.module.scss';
import Sidemenu from '../../../../../component/sidemenu/page';
import Headerbar from '../../../../../component/headerbar/page';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { getFirestore, collection, getDoc, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import AddMemberModal from '../../../../../component/Modal/addMemberModal/page';
import closeIcon from 'public/images/close-red.svg';
import sendIcon from 'public/images/send-icon.svg';
import backIcon from 'public/images/backArrow.svg';
import InviteNewUser from '../../../../../component/inviteNewUser/page';
import pount_sign from "public/images/pound_grey.svg";
import moment from 'moment';
import axios from 'axios';
import firebase from '../../../../../../utils/db/index'
import DatePickerStyles from '../../../../../component/DatePickerStyles/page';
import { getCookie } from 'cookies-next';

const EditCommittee = () => {
  const AuthorizationKey = process.env.NEXT_PUBLIC_FIREBASE_KEY
  const adminUid = getCookie("AdminUid")
  const adminEmail = getCookie("AdminEmail")
  const adminName = getCookie("AdminName")

  const [isDisabled, setIsDisabled] = useState(true);
  const [committeMemberData, setCommitteeMemberData] = useState([])
  const [sideShow, setSideShow] = useState(false)
  const [modalShow, setModalShow] = useState(false);
  const [showMemberList, setShowMemberList] = useState(true)
  const [users, setUsers] = useState([])
  const [frequency, setFrequency] = useState()
  const [member, setMember] = useState([])
  const [newMember, setNewMember] = useState([])
  const [lastPayOutDate, setLastPayOutDate] = useState([])
  const [order, setOrder] = useState([])
  const [deletePopupShow, setDeltePopupShow] = useState(true)
  const [checkedMember, setCheckedMember] = useState([])
  const [newCommittee, setNewCommittee] = useState({
    title: "",
    totalAmount: "",
    status: '',
    uid: '',
    deposit: '',
    collectionDate: "",
  })
  const [oldCommittee, setOldCommittee] = useState({})
  const [firstPayOutDate, setFirstPayOutDate] = useState()
  const [selectedDate, setSelectedDate] = useState()
  const [errorMsg, setErrorMsg] = useState(null)
  const [editCommittee, setEditCommittee] = useState(false)

  // For Protected Route End
  const router = useRouter()
  const params = useParams()
  const id = params.editcommittee

  // get individual Data with id------------->>>
  const getCommitteeData = async () => {
    const db = getFirestore()
    const docRef = doc(db, "Committee", id);
    const docsSnap = await getDoc(docRef)
    setNewCommittee({
      title: docsSnap.data().title,
      totalAmount: docsSnap.data().totalAmount,
      status: docsSnap.data().status,
      uid: docsSnap.data().uid,
      deposit: docsSnap.data().deposit,
      collectionDate: docsSnap.data().collectionDate,
    })
    const date = moment(moment(docsSnap.data().firstPayOutDate, 'DD-MM-YYYY')).format('MM-DD-YYYY')
    const selectedDate = moment(date).toDate()
    setSelectedDate(selectedDate)
    setFrequency(docsSnap.data().frequency)
    setFirstPayOutDate(docsSnap.data().firstPayOutDate)
    setOldCommittee({
      committeeId: docsSnap.id,
      title: docsSnap.data().title,
      totalAmount: docsSnap.data().totalAmount,
      status: docsSnap.data().status,
      uid: docsSnap.data().uid,
      deposit: docsSnap.data().deposit,
      frequency: docsSnap.data().frequency,
      firstPayOutDate: docsSnap.data().firstPayOutDate,
      collectionDate: docsSnap.data().collectionDate,
    })
  }

  // get committee members list ---------------->>
  const getCommitteeMemberData = async () => {
    const db = getFirestore()
    const colRef = collection(db, "Committee_Members")
    const docsSnap = await getDocs(colRef)
    let committeeMemberData = []
    docsSnap.forEach((doc) => {
      committeeMemberData.push({ docId: doc.id, ...doc.data() })
    })
    setCommitteeMemberData(committeeMemberData)
  }

  // get targeted committee member Data --->>>>
  const targetedCommitteeMember = () => {
    const data = committeMemberData.filter((item) => {
      if (item.committee_id == id) {
        return item
      }
    })
    return data
  }

  const getMemberData = async () => {
    const db = getFirestore()
    const xyz = targetedCommitteeMember()
    let memberData = []
    xyz?.forEach(async (item) => {
      if (item.uid) {
        const docRef = doc(db, "Users", item.uid);
        const docsSnap = await getDoc(docRef)
        memberData.push({ userName: docsSnap.data().name, userImage: docsSnap.data().image, uid: docsSnap.data().uid })
        setMember(prev => [...prev, { userName: docsSnap.data().name, userImage: docsSnap.data().image, uid: docsSnap.data().uid }])
        setCheckedMember(prev => [...prev, { userName: docsSnap.data().name, userImage: docsSnap.data().image, uid: docsSnap.data().uid }])
        setOldCommittee(prevState => ({
          ...prevState,
          member: memberData,
        }))
      }
    })
  }

  // get order data for last payOut Date------------->>>
  const getOrder = async () => {
    const db = getFirestore()
    const newCollectionRef = collection(db, 'All_Orders', id, 'Orders')
    const docsSnap = await getDocs(newCollectionRef)
    let orderData = []
    let lastPayOutDateData = []
    docsSnap.forEach(doc => {
      orderData.push({ docId: doc.id, ...doc.data() })
      lastPayOutDateData.push(doc.data().due_date)
    })
    setOrder(orderData)
    setLastPayOutDate(lastPayOutDateData)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewCommittee({ ...newCommittee, [name]: value })
    if (name === "collectionDate") {
      setEditCommittee(true)
    }
  }

  const handleDayInHours = (days) => {
    return days * 24 * 60 * 60 * 1000
  }

  const handleCollectionDate = (date) => {
    const todayTimestamp = moment().toDate().getTime()
    const collectionDateTime = newCommittee.collectionDate === '1 Week' ? handleDayInHours(6) : handleDayInHours(20)
    const validSelectedDate = todayTimestamp + collectionDateTime
    const selectedDateTime = moment(date).toDate().getTime();
    if (validSelectedDate > selectedDateTime) {
      const collectionDate = moment(validSelectedDate + handleDayInHours(1)).format("DD-MM-YYYY")
      setErrorMsg(`The earliest Pay-Out Date must be ${collectionDate} or greater`)
    } else {
      setErrorMsg(null)
    }
  }

  const handleFirstPayOutDate = (date) => {
    setSelectedDate(date)
    const firstPayOutDate = moment(date).format("DD-MM-YYYY")
    setFirstPayOutDate(firstPayOutDate)
    setEditCommittee(true)
  }

  // change date format for creating order due_date------->>
  const maxDate = () => {
    const targetDate = lastPayOutDate.sort(function (a, b) {
      const x = moment(a, "DD/MM/YYYY").toDate().getTime()
      const y = moment(b, "DD/MM/YYYY").toDate().getTime()
      return y - x
    })[0]
    return targetDate
  }

  // Funcation For Submit in EditCommittee--------------------->
  const handleClick = async () => {
    try {
      // Update Committee----------------->>>> start
      const db = getFirestore();
      const docRef = doc(db, "Committee", id);
      const data = {
        ...newCommittee,
        firstPayOutDate: firstPayOutDate,
        lastPayoutDate: firstPayOutDate,
        nextPayoutDate: firstPayOutDate,
        frequency: frequency,
        members: (member.length),
        timestamp: new Date().getTime(),
        membersData: [],
      };
      updateDoc(docRef, data)
        .then(docRef => { })
        .catch(error => {
          return error
        })
      // Add Committee----------------->>>> End
      // Add Notification Start-------------->>>>>>>>>>
      const notificationDetails = users.filter(item => {
        const memberName = newMember.map(i => i.uid)
        if (memberName.includes(item.uid)) {
          return item
        }
      })
      const notificationUid = notificationDetails.map(i => i.uid)
      const notificationDeviceToken = notificationDetails.map(i => i.device_token)
      await addDoc(collection(db, "Notifications"), {
        body: `${adminName} has invited you to join ${newCommittee.title}`,
        committee_id: docRef.id,
        sendBy: adminUid,
        timestamp: new Date().getTime(),
        title: "Committee Invitation",
        type: "comInvite",
        uid: notificationUid
      })
      // Add Notification End-------------->>>>>>>>>>
      // Add push Notification Start--------------->>>>>>>>
      notificationDeviceToken.map(i => {
        axios.post("https://fcm.googleapis.com/fcm/send",
          {
            "to": i,
            "notification": {
              "body": `${adminName} has invited you to join ${newCommittee.title}`,
              "title": "Committee Invitation"
            }
          }
          , {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': AuthorizationKey
            }
          })
      })
      // Add push Notification End -------------->>>>>>>>>>>
      if (docRef.id) {
        newMember.map(async (i, index) => {
          const addMemberList = users.find(user => user.uid === i.uid)
          const isAlreadyExit = oldCommittee?.member?.find(committee => committee.uid === i.uid)
          if (addMemberList && !isAlreadyExit) {
            // Add Committee Member-------------->>>>>>>>>>
            await addDoc(collection(db, "Committee_Members"),
              {
                committee_id: docRef.id,
                created_at: new Date().getTime(),
                image: addMemberList.image,
                invite_status: "Pending",
                invited_by: adminUid,
                name: addMemberList.name,
                payment_status: "Unpaid",
                phone_number: addMemberList.phone,
                uid: addMemberList.uid
              }
            )
            // Add Committee Member End-------------->>>>>>>>>>
            // Add Order   Start --------------->>>>>>>>>>>>>>> 
            // const addDurationDate = (frequency, newDate) => {
            //   var maxDate = newDate?.split("-").reverse().join("-")
            //   switch (frequency) {
            //     case "Monthly":
            //       return moment(maxDate).add((index + 1), "month").format("DD-MM-YYYY")
            //     case "Quaterly":
            //       return moment(maxDate).add((index + 1) * 3, "month").format("DD-MM-YYYY")
            //     case "Semi-Annually":
            //       return moment(maxDate).add((index + 1) * 6, "month").format("DD-MM-YYYY")
            //     case "Annually":
            //       return moment(maxDate).add((index + 1) * 12, "month").format("DD-MM-YYYY")
            //   }
            // }
            // const newCollectionRef = collection(db, 'All_Orders', id, 'Orders')
            // await addDoc(newCollectionRef, {
            //   due_date: addDurationDate(frequency, maxDate()),
            //   frequency: frequency,
            //   imageUser: addMemberList.image,
            //   status: "",
            //   uid: addMemberList.uid,
            //   userName: addMemberList.name
            // })
            // Add Order End--------------->>>>>>>>>>>>>>>
          }
        })
      }
      setNewMember([])
      router.push('/dashboard/managecommittee')
    }
    catch (error) {
      return error
    }
  }
  // For Add Member--->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  const getUserData = async () => {
    try {
      const db = getFirestore();
      const colRef = collection(db, "Users");
      const docsSnap = await getDocs(colRef);
      docsSnap.forEach(doc => {
        if (doc?.data()?.email !== adminEmail) {
          setUsers((prev) => [...prev, doc.data()])
        }
      })
    } catch (error) {
      return error
    }
  }

  const handleAddMember = (name, image, id) => {
    try {
      const isExitMember = checkedMember.filter((item) => item.uid === id)
      if (isExitMember) {
        setCheckedMember(prev => [...prev, { userName: name, userImage: image, uid: id }])
      }
      const isExitNewMember = newMember.filter((item) => item.uid === id)
      if (isExitNewMember) {
        setNewMember(prev => [...prev, { userName: name, userImage: image, uid: id }])
      }
    } catch (error) {
      return error
    }
  }

  // Manage Order_Committee Date ------------------>>>>
  const handleRemoveOrder = async (uid) => {
    try {
      var payOutDate;
      var position;
      order.sort(function (a, b) {
        const x = moment(a.due_date, "DD/MM/YYYY").toDate().getTime()
        const y = moment(b.due_date, "DD/MM/YYYY").toDate().getTime()
        return x - y
      })
      const actulOrder =
        order.filter((item, index) => {
          if (item.uid == uid) {
            payOutDate = item.due_date
            position = index
          }
          else {
            if (index > position)
              return item
          }
        })
      actulOrder.map((item, index) => {
        const addDurationDate = (frequency, newDate) => {
          var maxDate = newDate?.split("-").reverse().join("-")
          switch (frequency) {
            case "Monthly":
              return moment(maxDate).add((index), "month").format("DD-MM-YYYY")
            case "Quaterly":
              return moment(maxDate).add((index) * 3, "month").format("DD-MM-YYYY")
            case "Semi-Annually":
              return moment(maxDate).add((index) * 6, "month").format("DD-MM-YYYY")
            case "Annually":
              return moment(maxDate).add((index) * 12, "month").format("DD-MM-YYYY")
          }
        }
        const data = {
          ...item,
          due_date: addDurationDate(item.frequency, payOutDate)
        }
        firebase.firestore().collection(`All_Orders`).doc(id).collection('Orders').doc(item.docId).update(data).then(() => {
          firebase.firestore().collection('All_Orders').doc(id).collection('Orders').get().then((allData) => {
            let orderData = []
            allData.docs.forEach(doc => {
              orderData.push({ docId: doc.id, ...doc.data() })
            })
            const lastPayOutDateData = orderData.map((item) => item.due_date)
            setOrder(orderData)
            setLastPayOutDate(lastPayOutDateData)
          })

        }).catch(error => {
          return error
        })
      })
    } catch (error) {
      return error
    }
  }

  const handleRemoveMember = async (name, uid) => {
    try {
      const filterMember = member.filter((item) => item.uid !== uid)
      const filterCheckedMember = checkedMember.filter((item) => item.uid !== uid)
      setMember(filterMember)
      setCheckedMember(filterCheckedMember)
      // Deleting Data from committee member------------->>>>
      firebase.firestore().collection("Committee_Members").where("committee_id", "==", id).where("uid", "==", uid).get()
        .then(querySnapshot => {
          if (querySnapshot.docs[0]) {
            querySnapshot.docs[0]?.ref.delete()
          } else {
            const newMemberDetail = newMember.map(i => i.uid)
            const indexx = newMemberDetail.indexOf(uid)
            if (indexx > -1) {
              newMember.splice(indexx, 1);
              setNewMember([...newMember])
            }
          }
        })
      // Update the current Member list----------------->>>>>>>>>>.
      // Update the commitee with current member list----------------->>>>>
      const db = getFirestore();
      const docRef = doc(db, "Committee", id);
      const data = {
        members: (member.length),
      }
      updateDoc(docRef, data).then(data => { }).catch(error => { })
      // Delete This Member from Order list----------------->>>>>>>>>
      handleRemoveOrder(uid)
      const ordersUId = order.map(item => item.uid)
      if (ordersUId.includes(uid)) {
        firebase.firestore().collection('All_Orders').doc(id).collection('Orders').where("uid", "==", uid).get()
          .then(async (querySnapshot) => {
            if (querySnapshot.docs[0]) {
              querySnapshot.docs[0].ref.delete()
              // setLastPayOutDate([])
              const filterOrderData = order.filter((item) => {
                if (item.uid !== uid) {
                  // setLastPayOutDate(prev => [...prev, item.due_date])
                  return item
                }
              })
            }
          });
      }
      // const newCollectionRef = collection(db, 'All_Orders', id, 'Orders')
      // const docsSnap = await getDocs(newCollectionRef)
      // docsSnap.forEach(doc => {
      //    setLastPayOutDate(prev => [...prev, doc.data().due_date])
      // })
      // Manage Due_Date of new order_list------------->>>
    } catch (error) {
      return error
    }
  }

  useEffect(() => {
    getMemberData()
  }, [committeMemberData])

  useEffect(() => {
    getUserData()
    getCommitteeData()
    getCommitteeMemberData()
    getOrder()
  }, [])

  useEffect(() => {
    if (newCommittee.title === oldCommittee?.title && newCommittee.totalAmount === oldCommittee?.totalAmount && newCommittee.collectionDate === oldCommittee?.collectionDate && firstPayOutDate === oldCommittee?.firstPayOutDate && frequency === oldCommittee?.frequency && member?.length === oldCommittee.member?.length && member.every((member) =>
      oldCommittee.member.some(
        (memberInDb) =>
          member.uid === memberInDb.uid
      )
    )) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [newCommittee.title, newCommittee.totalAmount, firstPayOutDate, frequency, member, oldCommittee])

  useEffect(() => {
    if (newCommittee.collectionDate && selectedDate && editCommittee)
      handleCollectionDate(selectedDate)
  }, [newCommittee.collectionDate, selectedDate, editCommittee])

  return (
    <>
      <main className={`${styles.main} main_wraper ${sideShow ? 'sidebar_small' : 'sidebar_full'}`}  >
        <div className={`${styles.sidebar} leftsidebar`}>
          <Sidemenu sideShow={sideShow} setSideShow={setSideShow} />
        </div>
        <div className={`${styles.centerwrapper} centerpage`}>
          <div className={`${styles.top_manubar} menubar_toppage sticky_top`}>
            <Headerbar title="Edit Committee" />
          </div>
          <div className={`${styles.page_inner} dashbaord_inner_pagebx`}>
            <div className='managecom_list pt-10'>
              <Card className='cstmcard create_commit_bx'>
                <Card.Body>
                  <div className='card_subtitle'>
                    <h3 className='fs-18 fw-500 secondary_color divider_bx pb-20 d-flex'>
                      <Button
                        className="cstm_iconbtn_sm"
                        variant="link"
                        onClick={() =>
                          router.push("/dashboard/managecommittee")
                        }
                      >
                        <Image
                          src={backIcon}
                          width={14}
                          height={14}
                          alt="backicon"
                        />
                      </Button>
                      Update Details
                    </h3>
                    <div className='addd_form'>
                      <div className='sm_form_box_full'>
                        <Form className='cstm_formbx form_md pt-10'>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="form_cstm mb-3">
                                <Form.Label>Committee Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter committee name"
                                  name='title'
                                  value={newCommittee.title}
                                  onChange={handleChange}
                                />
                              </Form.Group>
                              <Form.Group className="form_cstm mb-3">
                                <Form.Label>Committee Amount</Form.Label>
                                <div className='currencySign'>
                                  <Image src={pount_sign} width={12} height={12} />
                                  <Form.Control type="text" placeholder="Enter amount"
                                    name='totalAmount'
                                    value={newCommittee.totalAmount}
                                    onChange={handleChange}
                                  />
                                </div>
                              </Form.Group>
                              <Form.Group className="form_cstm mb-3">
                                <Form.Label>Frequency Of Pay-Out</Form.Label>
                                <Form.Select aria-label="Default select example" className='form-control' onChange={(e) => setFrequency(e.target.value)}>
                                  <option> {frequency ? frequency : "Select Frequency Of Pay-Out"} </option>
                                  <option>Monthly</option>
                                  <option>Quaterly</option>
                                  <option>Semi-Annually</option>
                                  <option>Annually</option>
                                </Form.Select>
                              </Form.Group>
                              <Form.Group className="form_cstm mb-3">
                                <Form.Label className='d-block'>Collection Date</Form.Label>
                                <Form.Check
                                  id="1 Week"
                                  name="collectionDate"
                                  value="1 Week"
                                  type="radio"
                                  aria-label="1 Week"
                                  label="1 Week"
                                  onChange={handleChange}
                                  checked={newCommittee.collectionDate === "1 Week"}
                                  className='d-inline-block me-3'
                                />
                                <Form.Check
                                  id="3 Weeks"
                                  name="collectionDate"
                                  value="3 Weeks"
                                  type="radio"
                                  aria-label="3 Weeks"
                                  label="3 Weeks"
                                  onChange={handleChange}
                                  checked={newCommittee.collectionDate === "3 Weeks"}
                                  className='d-inline-block'
                                />
                              </Form.Group>
                              <Form.Group className="form_cstm mb-3">
                                <Form.Label>First Pay-Out Date</Form.Label>
                                <div className='add_date'>
                                  <DatePickerStyles dateClass="cursor-pointer form-control" placeholder="Select First Pay-Out Date" selected={firstPayOutDate} handleDate={handleFirstPayOutDate} showPreviousDates={true} />
                                </div>
                              </Form.Group>
                              <p className='text-error'> {errorMsg} </p>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="form_cstm mb-3">
                                <Form.Label>Add members</Form.Label>
                                <div className='add_member_bx1 form-control' onClick={() => setModalShow(true)}>
                                  <Button variant="link" size="sm" className='btn_icon'>
                                    <span className='icon_bx'>
                                      <Image src={sendIcon} width={18} height={18} alt="Send Icon" className='me-1' /></span>
                                  </Button>
                                  <h4>Click here to add member</h4>
                                </div>
                              </Form.Group>
                              <ul className='invite_newuser user_scrolbx max_h230'>
                                {
                                  member.map((item, index) => (
                                    item.userName && showMemberList ?
                                      <li key={index}>
                                        <InviteNewUser
                                          imagebx={item.userImage}
                                          title={item.userName}
                                          imagebxright={closeIcon}
                                          handleRemoveMember={handleRemoveMember}
                                          uid={item.uid}
                                          deletePopupShow={deletePopupShow}
                                          setDeltePopupShow={setDeltePopupShow}
                                        />
                                      </li> : null
                                  ))
                                }
                              </ul>
                            </Col>
                            <Col md={6} xxl={3}>
                              <div className='pt-30'>
                                <Row className='gutter_sml'>
                                  <Col>
                                    <Button variant="primary" size="md" className='w-100' onClick={handleClick}
                                      disabled={isDisabled}
                                    >
                                      Update
                                    </Button>
                                  </Col>
                                  <Col>
                                    <Button variant="secondary" size="md" className='w-100' onClick={() => router.push('/dashboard/managecommittee')}>
                                      Cancel
                                    </Button>
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
        {/* overlay box */}
        <div className='overlay_bg'></div>
        {/* overlay end */}
      </main>
      {/* add member modal */}
      <AddMemberModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={users}
        member={member}
        setShowMemberList={setShowMemberList}
        setModalShow={setModalShow}
        setMember={setMember}
        newMember={newMember}
        setNewMember={setNewMember}
        checkedMember={checkedMember}
        setCheckedMember={setCheckedMember}
        type="edit"
        handleRemoveMember={handleRemoveMember}
      />
      {/* add meber modal end */}
    </>
  )
}

export default EditCommittee
