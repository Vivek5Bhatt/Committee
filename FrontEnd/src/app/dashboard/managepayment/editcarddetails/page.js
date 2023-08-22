"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import styles from '../../../../style/dashboard.module.scss';
import Sidemenu from '../../../../component/sidemenu/page';
import Headerbar from '../../../../component/headerbar/page';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import addicon from 'public/images/add-white.svg';
import backIcon from 'public/images/backArrow.svg';
import { collection, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';

const EditCardDetails = () => {
  const [sideShow, setSideShow] = useState(false)
  const router = useRouter()
  const [loaderShow, setLoaderShow] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    name: '',
    bank_name: '',
    account_Number: '',
    ifsc_code: '',
    docId: ''
  })

  const getCardDetails = async () => {
    try {
      setLoaderShow(true);
      const db = getFirestore();
      const colRef = collection(db, "Add_Card");
      const docsSnap = await getDocs(colRef);
      docsSnap.forEach((doc) => {
        setCardDetails({
          name: doc.data().name,
          bank_name: doc.data().bank_name,
          account_Number: doc.data().account_Number,
          ifsc_code: doc.data().ifsc_code,
          docId: doc.id
        });
      });
      setLoaderShow(false);
    } catch (error) {
      return error
    }
  };

  const updateCardInfo = (event) => {
    try {
      const { name, value } = event.target
      setCardDetails({ ...cardDetails, [name]: value })
    } catch (error) {
      return error
    }
  }

  const handleUpdateCardClick = () => {
    const db = getFirestore();
    const docRef = doc(db, "Add_Card", cardDetails.docId);
    const data = {
      ...cardDetails
    };
    updateDoc(docRef, data)
      .then(docRef => {
        router.push('/dashboard/managepayment/carddetails')
      })
      .catch(error => {
        return error
      })
  }

  useEffect(() => {
    getCardDetails();
  }, []);

  return (
    <>
      {
        cardDetails ? <main className={`${styles.main} main_wraper ${sideShow ? 'sidebar_small' : 'sidebar_full'}`}  >
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
                            Edit Card Details
                          </h3>
                        </div>
                        <div className='cardbox2'>
                          <Button variant="primary" size="sm" className='btn_icon' onClick={() => router.push('/dashboard/managepayment/addnewcard')}>
                            <span className='icon_bx'><Image src={addicon} width={13} height={13} alt="addicon" className='me-1' /></span>
                            <span className='btn_tex'> Add New</span>
                          </Button>
                        </div>
                      </div>
                      <div className='addd_form'>
                        <div className='sm_form_box'>
                          <Form className='cstm_formbx form_md'>
                            <Form.Group className="form_cstm mb-3">
                              <Form.Label>Name</Form.Label>
                              <Form.Control type="text"
                                placeholder="Enter name"
                                name='name'
                                value={cardDetails.name}
                                onChange={updateCardInfo}
                              />
                            </Form.Group>
                            <Form.Group className="form_cstm mb-3">
                              <Form.Label>Bank name</Form.Label>
                              <Form.Control type="text"
                                placeholder="Enter bank name"
                                name='bank_name'
                                value={cardDetails.bank_name}
                                onChange={updateCardInfo}
                              />
                            </Form.Group>
                            <Form.Group className="form_cstm mb-3">
                              <Form.Label>Account number</Form.Label>
                              <Form.Control type="text"
                                placeholder="Enter Account number"
                                name='account_Number'
                                value={cardDetails.account_Number}
                                onChange={updateCardInfo}
                              />
                            </Form.Group>
                            <Form.Group className="form_cstm mb-3">
                              <Form.Label>IFSC code</Form.Label>
                              <Form.Control type="text"
                                placeholder="Enter IFSC code"
                                name='ifsc_code'
                                value={cardDetails.ifsc_code}
                                onChange={updateCardInfo}
                              />
                            </Form.Group>
                            <div className='pt-30'>
                              <Row className='gutter_sml'>
                                <Col>
                                  {/* <Button variant="primary" size="md" className='w-100' onClick={() => router.push('/dashboard/managepayment/carddetails')}> */}
                                  <Button variant="primary" size="md" className='w-100' onClick={handleUpdateCardClick}>
                                    Update
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
          :
          null
      }
    </>
  )
}

export default EditCardDetails
