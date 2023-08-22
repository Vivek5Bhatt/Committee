"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import styles from '../../../../style/dashboard.module.scss';
import Sidemenu from '../../../../component/sidemenu/page';
import Headerbar from '../../../../component/headerbar/page';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import AddMemberModal from '../../../../component/Modal/addMemberModal/page';
import closeIcon from 'public/images/close-red.svg';
import sendIcon from 'public/images/send-icon.svg';
import backIcon from 'public/images/backArrow.svg';
import InviteNewUser from '../../../../component/inviteNewUser/page';
import DatePickerStyles from '../../../../component/DatePickerStyles/page';
import pount_sign from "public/images/pound_grey.svg";
import moment from 'moment';
import axios from 'axios';
import { getCookie } from 'cookies-next';

const CreateCommittee = () => {
  const AuthorizationKey = process.env.NEXT_PUBLIC_FIREBASE_KEY
  const adminUid = getCookie("AdminUid")
  const adminEmail = getCookie("AdminEmail")
  const adminName = getCookie("AdminName")

  // For Protected Route End
  const [isDisabled, setIsDisabled] = useState(true);
  const [sideShow, setSideShow] = useState(false)
  const [modalShow, setModalShow] = useState(false);
  const [users, setUsers] = useState([])
  const [frequency, setFrequency] = useState()
  const [member, setMember] = useState([])
  const [showMemberList, setShowMemberList] = useState(false)
  const [checkedMember, setCheckedMember] = useState([])
  const [newCommittee, setNewCommittee] = useState({
    title: "",
    totalAmount: "",
    collectionDate: "",
  })
  const [firstPayOutDate, setFirstPayOutDate] = useState()
  const [selectedDate, setSelectedDate] = useState()
  const [errorMsg, setErrorMsg] = useState(null)

  const router = useRouter()

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewCommittee({ ...newCommittee, [name]: value })
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
  }

  // Funcation For Submit in CreateCommittee--------------------->
  const handleClick = async () => {
    try {
      // Add Committee----------------->>>> start
      const db = getFirestore();
      const docRef = await addDoc(collection(db, "Committee"),
        {
          title: newCommittee.title,
          totalAmount: newCommittee.totalAmount,
          collectionDate: newCommittee.collectionDate,
          firstPayOutDate: firstPayOutDate,
          lastPayoutDate: firstPayOutDate,
          nextPayoutDate: firstPayOutDate,
          frequency: frequency,
          members: (member.length),
          timestamp: new Date().getTime(),
          deposit: "0",
          membersData: [],
          status: "Active",
          uid: adminUid,
          committeeCycle: 1,
          totalDepositPayout: 0,
          hideOrdersForUser: false
        });
      // Add Committee----------------->>>> End
      // Add Notification Start-------------->>>>>>>>>>
      const notificationDetails = users.filter(item => {
        const memberName = member.map(i => i.uid)
        if (memberName.includes(item.uid)) {
          return item
        }
      })
      const notificationUid = notificationDetails.map(i => i.uid)
      const notificationDeviceToken = notificationDetails.map(i => i.device_token)
      await addDoc(collection(db, "Notifications"), {
        body: `${adminName} has invited you to join '${newCommittee.title}'`,
        committee_id: docRef.id,
        sendBy: adminUid,
        deletedFor: [],
        timestamp: new Date().getTime(),
        title: "Committee Invitation",
        type: "comInvite",
        uid: notificationUid,
        isSwipeToDeleteActive: false
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
          }, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': AuthorizationKey
          }
        })
      })
      // Add push Notification End -------------->>>>>>>>>>>
      if (docRef.id) {
        member.map(async (i, index) => {
          const addMemberList = users.find(user => user.uid == i.uid)
          if (addMemberList) {
            // Add Committee Member-------------->>>>>>>>>>
            await addDoc(collection(db, "Committee_Members"),
              {
                committee_id: docRef.id,
                created_at: new Date().getTime(),
                image: "",
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
            // const addDurationDate = (frequency) => {
            //   switch (frequency) {
            //     case "Monthly":
            //       return moment(newCommittee.firstPayOutDate).add((index), "month").format("DD-MM-YYYY")
            //     case "Quaterly":
            //       return moment(newCommittee.firstPayOutDate).add((index) * 3, "month").format("DD-MM-YYYY")
            //     case "Semi-Annually":
            //       return moment(newCommittee.firstPayOutDate).add((index) * 6, "month").format("DD-MM-YYYY")
            //     case "Annually":
            //       return moment(newCommittee.firstPayOutDate).add((index) * 12, "month").format("DD-MM-YYYY")
            //   }
            // }
            // const newCollectionRef = collection(db, 'All_Orders', docRef.id, 'Orders')
            // await addDoc(newCollectionRef, {
            //   due_date: addDurationDate(frequency),
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
      router.push('/dashboard/managecommittee')
    } catch (error) {
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
    } catch (error) {
      return error
    }
  }

  const handleRemoveMember = (name, id) => {
    try {
      const filterMember = member.filter((item) => item.uid !== id)
      const filterChekedMember = checkedMember.filter((item) => item.uid !== id)
      setMember(filterMember)
      setCheckedMember(filterChekedMember)
    } catch (error) {
      return error
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  useEffect(() => {
    if (!newCommittee.title || !newCommittee.totalAmount || !newCommittee.collectionDate || !firstPayOutDate || !frequency || !member.length || errorMsg) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [newCommittee.title, newCommittee.totalAmount, newCommittee.collectionDate, firstPayOutDate, frequency, member, errorMsg])

  useEffect(() => {
    if (newCommittee.collectionDate && selectedDate)
      handleCollectionDate(selectedDate)
  }, [newCommittee.collectionDate, selectedDate])

  // For Add Member--->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>End>>>>>>>>>

  console

  return (
    <>
      <main className={`${styles.main} main_wraper ${sideShow ? 'sidebar_small' : 'sidebar_full'}`}  >
        <div className={`${styles.sidebar} leftsidebar`}>
          <Sidemenu sideShow={sideShow} setSideShow={setSideShow} />
        </div>
        <div className={`${styles.centerwrapper} centerpage`}>
          <div className={`${styles.top_manubar} menubar_toppage sticky_top`}>
            <Headerbar title="Create Committee" />
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
                      Add Details
                    </h3>
                    <div className='addd_form'>
                      <div className='sm_form_box_full'>
                        <Form className='cstm_formbx form_md pt-10'>
                          <Row>
                            <Col md="6">
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
                                  <option>Select Frequency Of Pay-Out</option>
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
                                  <DatePickerStyles dateClass="cursor-pointer form-control" placeholder="Select First Pay-Out Date" handleDate={handleFirstPayOutDate} disabled={newCommittee.collectionDate === ""} showPreviousDates={true} />
                                </div>
                              </Form.Group>
                              <p className='text-error'> {errorMsg} </p>
                            </Col>
                            <Col md="6">
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
                              {/* add member list */}
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
                                        />
                                      </li> : null
                                  ))
                                }
                              </ul>
                            </Col>
                            <Col md={6}>
                              <div className='pt-30'>
                                <Row className='gutter_sml'>
                                  <Col>
                                    <Button variant="primary" size="md" className='w-100' onClick={handleClick} disabled={isDisabled}>
                                      Submit
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
        handleAddMember={handleAddMember}
        handleRemoveMember={handleRemoveMember}
        setShowMemberList={setShowMemberList}
        setModalShow={setModalShow}
        type="create"
        setMember={setMember}
        member={member}
        checkedMember={checkedMember}
        setCheckedMember={setCheckedMember}
      />
      {/* add meber modal end */}
    </>
  )
}

export default CreateCommittee
