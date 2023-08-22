"use client"
import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import styles from '../../../../style/dashboard.module.scss';
import Sidemenu from '../../../../component/sidemenu/page';
import Headerbar from '../../../../component/headerbar/page';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import backIcon from 'public/images/backArrow.svg';
import addicon from 'public/images/add-white.svg';
import Editicon from 'public/images/edit_icon-white.svg';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

const AddNewCcard = () => {
  const [sideShow, setSideShow] = useState(false)
  const router = useRouter()
  const [addCard, setAddCard] = useState({
    name: '',
    bank_name: '',
    account_Number: '',
    ifsc_code: ''
  })

  const addCardInfo = (event) => {
    try {
      const { name, value } = event.target
      setAddCard({ ...addCard, [name]: value })
    } catch (error) {
      return error
    }
  }

  const handleAddCardClick = (e) => {
    try {
      e.preventDefault()
      const { name, bank_name, account_Number, ifsc_code } = addCard
      const db = getFirestore();
      addDoc(collection(db, "Add_Card"), { name, bank_name, account_Number, ifsc_code }).
        then(docRef => router.push('/dashboard/managepayment/carddetails')).
        catch(e => e)
    } catch (error) {
      return error
    }
  }

  return (
    <>
      <main className={`${styles.main} main_wraper ${sideShow ? 'sidebar_small' : 'sidebar_full'}`}  >
        <div className={`${styles.sidebar} leftsidebar`}>
          <Sidemenu sideShow={sideShow} setSideShow={setSideShow} />
        </div>
        <div className={`${styles.centerwrapper} centerpage`}>
          <div className={`${styles.top_manubar} menubar_toppage sticky_top`}>
            <Headerbar title="Manage Payment" />
          </div>
          <div className={`${styles.page_inner} dashbaord_inner_pagebx`}>
            <div className='managecom_list pt-10'>
              <Card className='cstmcard create_commit_bx min_h70'>
                <Card.Body>
                  <div className='card_subtitle'>
                    <div className='carddetail_head divider_bx pb-20 d-flex align-items-center justify-content-between flex-wrap'>
                      <div className='cardbox1'>
                        <h3 className='fs-18 fw-500 secondary_color d-flex'>
                          <Button
                            className="cstm_iconbtn_sm"
                            variant="link"
                            onClick={() =>
                              router.push("/dashboard/managepayment/carddetails")
                            }
                          >
                            <Image
                              src={backIcon}
                              width={14}
                              height={14}
                              alt="backicon"
                            />
                          </Button>
                          Add new card
                        </h3>
                      </div>
                    </div>
                    <div className='addd_form'>
                      <div className='sm_form_box'>
                        <Form className='cstm_formbx form_md'>
                          <Form.Group className="form_cstm mb-3">
                            <Form.Label>Account Holder Name</Form.Label>
                            <Form.Control type="text"
                              placeholder="Enter full name"
                              name='name'
                              value={addCard.name}
                              onChange={addCardInfo}
                            />
                          </Form.Group>
                          <Form.Group className="form_cstm mb-3">
                            <Form.Label>Bank name</Form.Label>
                            <Form.Control type="text"
                              placeholder="Enter bank name"
                              name='bank_name'
                              value={addCard.bank_name}
                              onChange={addCardInfo}
                            />
                          </Form.Group>
                          <Form.Group className="form_cstm mb-3">
                            <Form.Label>Account number</Form.Label>
                            <Form.Control type="text"
                              placeholder="Enter Account number"
                              name='account_Number'
                              value={addCard.account_Number}
                              onChange={addCardInfo}
                            />
                          </Form.Group>
                          <Form.Group className="form_cstm mb-3">
                            <Form.Label>IFSC code</Form.Label>
                            <Form.Control type="text"
                              placeholder="Enter IFSC code"
                              name='ifsc_code'
                              value={addCard.ifsc_code}
                              onChange={addCardInfo}
                            />
                          </Form.Group>
                          <div className='pt-30'>
                            <Row className='gutter_sml'>
                              <Col>
                                {/* <Button variant="primary" size="md" className='w-100' onClick={() => router.push('/dashboard/managepayment/carddetails')}> */}
                                <Button variant="primary" size="md" className='w-100' onClick={handleAddCardClick}>
                                  Add
                                </Button>
                              </Col>
                              <Col>
                                <Button variant="secondary" size="md" className='w-100' onClick={() => router.push('/dashboard/managepayment/carddetails')}>
                                  Cancel
                                </Button>
                              </Col>
                            </Row>
                          </div>
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
    </>
  )
}

export default AddNewCcard
