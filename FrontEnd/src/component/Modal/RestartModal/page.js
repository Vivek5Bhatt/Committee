"use client"
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import moment from 'moment';
import firebase from '../../../../utils/db/index'
import { useRouter } from 'next/navigation';

const RestartModal = (props) => {
  const router = useRouter();
  const { firstPayoutDate, amount, committee, id } = props
  const [order, setOrder] = useState([])
  const [commMemberData, setCommMemberData] = useState([])
  const [restartDetails, setRestartDetails] = useState({
    totalAmount: amount,
    firstPayoutDate: firstPayoutDate
  })
  useEffect(() => {
    setRestartDetails({
      totalAmount: amount,
      firstPayoutDate: firstPayoutDate
    })
  }, [firstPayoutDate, amount])

  useEffect(() => {
    getOrderAndCommitteeData()
  }, [])

  const handleRestartChange = (event) => {
    const { name, value } = event.target
    setRestartDetails({ ...restartDetails, [name]: value })
  }

  const getOrderAndCommitteeData = async () => {
    const db = getFirestore()
    const orderRef = collection(db, 'All_Orders', id, 'Orders')
    const committeeMemberRef = collection(db, 'Committee_Members')

    const orderSnap = await getDocs(orderRef)
    const commiteeMemberSnap = await getDocs(query(committeeMemberRef, where('committee_id', '==', id)))

    let orderData = []
    let committeeMemberData = []
    orderSnap.forEach(doc => {
      orderData.push({ docId: doc.id, ...doc.data() })
    })

    commiteeMemberSnap.forEach(doc => {
      committeeMemberData.push({ docId: doc.id, ...doc.data() })
    })

    setCommMemberData(committeeMemberData)
    setOrder(orderData)
  }

  const handleRestart = async () => {
    const db = getFirestore()
    const committeeRef = doc(db, "Committee", id);
    const committeeData = {
      committeeCycle: committee?.committeeCycle + 1,
      firstPayOutDate: moment(restartDetails.firstPayoutDate).format("DD-MM-YYYY"),
      lastPayoutDate: moment(restartDetails.firstPayoutDate).format("DD-MM-YYYY"),
      nextPayoutDate: moment(restartDetails.firstPayoutDate).format("DD-MM-YYYY"),
      deposit: "0",
      totalAmount: restartDetails.totalAmount,
    }
    updateDoc(committeeRef, committeeData)
      .then(() => {
        updateOrder()
        updateCommitteeMember()
        router.push("/dashboard/managecommittee")
      })
      .catch(error => {
        return error
      })


  }

  const updateOrder = () => {
    order.map((item, index) => {
      const addDurationDate = (frequency, newDate) => {
        var maxDate = newDate
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
        due_date: addDurationDate(item.frequency, restartDetails.firstPayoutDate)
      }
      firebase.firestore().collection(`All_Orders`).doc(id).collection('Orders').doc(item.docId).update(data)
    })
  }

  const updateCommitteeMember = () => {
    commMemberData.map((item, index) => {
      const data = {
        ...item,
        payment_status: 'Unpaid'
      }
      firebase.firestore().collection('Committee_Members').doc(item.docId).update(data)
    })
  }

  return (
    <>
      <Modal className='cstm_modal'
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <h6>Restart the committee with the same users</h6>
          <Modal.Title id="contained-modal-title-vcenter">
          </Modal.Title>
        </Modal.Header>
        <Form className='cstm_formbx form_md'>
          <Modal.Body>

            <Form.Group className="form_cstm mb-3">
              <Form.Label>Amount Per Person</Form.Label>
              <Form.Control type="text" placeholder="Enter amount"
                name='totalAmount'
                value={restartDetails?.totalAmount}
                onChange={handleRestartChange}
              />
            </Form.Group>

            <Form.Group className="form_cstm mb-3">
              <Form.Label>First Pay-Out Date</Form.Label>
              <div className='add_date'>
                <Form.Control type="date" placeholder="Add Date"
                  name='firstPayoutDate'
                  value={restartDetails?.firstPayoutDate}
                  onChange={handleRestartChange}
                />
              </div>
            </Form.Group>

          </Modal.Body>

          <Modal.Footer>
            <div className='btnbottom w-100 d-flex gap_15 flex-wrap align-item-center' >
              <Button variant="secondary" size="md" className='w-100 flex-1' onClick={props.onHide}>
                Cancel
              </Button>
              <Button variant="primary" size="md" className='w-100 flex-1 primary' onClick={handleRestart}>
                Restart
              </Button>

            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default RestartModal;