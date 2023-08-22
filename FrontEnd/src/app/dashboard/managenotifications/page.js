"use client"
import { useEffect, useState } from 'react';
import styles from '../../../style/dashboard.module.scss';
import Sidemenu from '../../../component/sidemenu/page';
import Headerbar from '../../../component/headerbar/page';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import NotificationComponent from '../../../component/notificationcomponent/page';
import avtar1 from 'public/images/avtar1.svg';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import moment from 'moment';

const ManageNotifications = () => {
  // // For Protected Route End
  const [sideShow, setSideShow] = useState(false)
  const [notification, setNotification] = useState([])

  const getNotificationData = async () => {
    const db = getFirestore();
    const colRef = collection(db, "Notifications");
    const docsSnap = await getDocs(colRef);
    let notificationData = []
    docsSnap.forEach(doc => {
      notificationData.push({ docId: doc.id, ...doc.data() })
    })
    setNotification(notificationData)
  }

  useEffect(() => {
    getNotificationData()
  }, [])

  return (
    <>
      <main className={`${styles.main} main_wraper ${sideShow ? 'sidebar_small' : 'sidebar_full'}`}  >
        <div className={`${styles.sidebar} leftsidebar`}>
          <Sidemenu sideShow={sideShow} setSideShow={setSideShow} />
        </div>
        <div className={`${styles.centerwrapper} centerpage`}>
          <div className={`${styles.top_manubar} menubar_toppage sticky_top`}>
            <Headerbar title="Manage Notifications" />
          </div>
          <div className={`${styles.page_inner} dashbaord_inner_pagebx`}>
            <div className='managecom_list pt-10'>
              <Card className='cstmcard create_commit_bx min_h70'>
                <Card.Body>
                  <div className='card_subtitle'>
                    <h3 className='fs-18 fw-500 secondary_color divider_bx pb-20'>Manage Notifications</h3>
                    <div className='manage-notification'>
                      <div className='inner-notif'>
                        <Row>
                          <Col md={6} lg={7} xxl={8}>
                            <div className='manage_notif_outer pe-15'>
                              <div className='manage_notif_card'>
                                <div className='new_notific'>
                                  <Badge className='cstm_badge round_badge new_tag' bg="red">New</Badge>
                                </div>
                                <div className='notification_body'>
                                  <h4>Lorem Ipsum is simply dummy text <span className='notification_smltex'> (Just now) </span></h4>
                                  <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing</p>
                                </div>
                              </div>
                              <div className='manage_notif_card'>
                                <div className='new_notific'>
                                  <Badge className='cstm_badge round_badge new_tag' bg="red">New</Badge>
                                </div>
                                <div className='notification_body'>
                                  <h4>Lorem Ipsum is simply dummy text <span className='notification_smltex'> (Just now) </span></h4>
                                  <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing</p>
                                </div>
                              </div>
                              <div className='manage_notif_card'>
                                <div className='new_notific'>
                                  <Badge className='cstm_badge round_badge new_tag' bg="red">New</Badge>
                                </div>
                                <div className='notification_body'>
                                  <h4>Lorem Ipsum is simply dummy text <span className='notification_smltex'> (Just now) </span></h4>
                                  <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing</p>
                                </div>
                              </div>
                              <div className='manage_notif_card'>
                                <div className='new_notific'>
                                  <Badge className='cstm_badge round_badge new_tag' bg="red">New</Badge>
                                </div>
                                <div className='notification_body'>
                                  <h4>Lorem Ipsum is simply dummy text <span className='notification_smltex'> (Just now) </span></h4>
                                  <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing</p>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col md={6} lg={5} xxl={4}>
                            <div className='other_notification'>
                              {/* <div className='notif_title divider_bottom'>
                                <h4>Other Notifications</h4>
                              </div> */}
                              <div className='manage_notificbx'>
                                <div className='notif_title divider_bottom'>
                                  <h4>Other Notifications</h4>
                                </div>
                              </div>
                              <div className='notif_bodybx'>
                                {
                                  notification.map((item, index) =>
                                    <NotificationComponent
                                      key={index}
                                      imagebx={avtar1}
                                      title={item.title}
                                      subtitle={item.body}
                                      time={moment(item.timestamp).fromNow(true)}
                                    />
                                  )
                                }
                              </div>
                            </div>
                          </Col>
                        </Row>
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

export default ManageNotifications
