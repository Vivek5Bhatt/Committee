"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../../../style/dashboard.module.scss';
import Sidemenu from '../../../component/sidemenu/page';
import Headerbar from '../../../component/headerbar/page';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import avtar1 from 'public/images/avtar1.svg';
// import avtar2 from 'public/images/avtar2.svg';
// import avtar3 from 'public/images/avtar3.svg';
// import halfstar from 'public/images/halfstar.svg';
import fullstar from 'public/images/fullstar.svg';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import ImageLoader from "../../../component/ImageLoader/page";
import Pagination from '../../../component/pagination/page';
import useSortableData from '../../../../utils/tableSort/page';

const FeedbacksAndReports = () => {
  const [loaderShow, setLoaderShow] = useState(false);
  const [sideShow, setSideShow] = useState(false)
  const [feedback, setFeedback] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  const getFeedbackData = async () => {
    setLoaderShow(true);
    const db = getFirestore();
    const colRef = collection(db, "Feedback");
    const userRef = collection(db, "Users");
    const docsSnap = await getDocs(colRef);
    const userDocSnap = await getDocs(userRef);
    let feedbackData = [];
    let userData = [];
    userDocSnap.forEach((doc) => {
      userData.push({ docId: doc.id, ...doc.data() });
    });
    docsSnap.forEach(doc => {
      feedbackData.push({ docId: doc.id, ...doc.data() })
    })
    let finalUserData = feedbackData.map((item) => {
      const userDetails = userData.find((data) => data.docId === item.uid)
      return { ...item, user: userDetails }
    })
    finalUserData.sort(function (x, y) {
      return y.timestamp - x.timestamp;
    })
    setFeedback(finalUserData)
    setLoaderShow(false);
  }

  // sorting table with name start ------------------>>>
  const { items, requestSort, sortConfig } = useSortableData(feedback)

  //  Pagination Start ----------------------->>>>>>>>>>>>
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = items.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(items.length / recordsPerPage)
  //  Pagination End ----------------------->>>>>>>>>>>>

  useEffect(() => {
    getFeedbackData()
  }, [])

  return (
    <>
      <main className={`${styles.main} main_wraper ${sideShow ? 'sidebar_small' : 'sidebar_full'}`}  >
        <div className={`${styles.sidebar} leftsidebar`}>
          <Sidemenu sideShow={sideShow} setSideShow={setSideShow} />
        </div>
        <div className={`${styles.centerwrapper} centerpage`}>
          <div className={`${styles.top_manubar} menubar_toppage sticky_top`}>
            <Headerbar title="Feedbacks" />
          </div>
          <div className={`${styles.page_inner} dashbaord_inner_pagebx`}>
            <div className='managecom_list pt-10'>
              <Card className='cstmcard create_commit_bx min_h70'>
                <Card.Body>
                  <div className='card_subtitle'>
                    <h3 className='fs-18 fw-500 secondary_color divider_bx pb-20'>All Feedbacks</h3>
                    <div className='manage-notification'>
                      <div className='inner-notif'>
                        <Row>
                          <Col md={12} lg={12} xxl={12}>
                            <div className='manage_notif_outer max-hauto pe-15 position-relative'>
                              {currentRecords.length ? currentRecords.map((item, index) => {
                                return (
                                  <div className='feedback_cardbx' key={index}>
                                    <div className='feedback_cardinner feedback_fullbx'>
                                      <div className='feedback_cardinner_bx d-flex flex-wrap'>
                                        <div className='avtarbx'>
                                          <Image
                                            src={item?.user?.image ? item?.user?.image : avtar1}
                                            width={65}
                                            height={65}
                                            alt='avtar1'
                                          />
                                        </div>
                                        <div className='feedback_cardbody'>
                                          <h4>{item?.user?.name}</h4>
                                          <div className='rating_bx'>
                                            <ul className='rating_list'>
                                              {
                                                Array.from(Array(item?.rating), (e, i) => {
                                                  return <li>
                                                    <Image
                                                      src={fullstar}
                                                      width={15}
                                                      height={15}
                                                      alt='star'
                                                    />
                                                  </li>
                                                })
                                              }
                                            </ul>
                                            <span className='total_rating'>({item?.rating})</span>
                                          </div>
                                          <p>{item?.message}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }) : (
                                <div colSpan={6} className="td_spinner text-center d-flex align-items-center justify-content-center">
                                  {!loaderShow ? (
                                    <span className="no_data_tex">
                                      No data found!
                                    </span>
                                  ) : (
                                    <ImageLoader />
                                  )}
                                </div>)}
                              {/* <div className='feedback_cardbx'>
                                <div className='feedback_cardinner'>
                                  <div className='feedback_cardinner_bx d-flex flex-wrap'>
                                    <div className='avtarbx'>
                                      <Image
                                        src={avtar2}
                                        width={65}
                                        height={65}
                                        alt='avtar1'
                                      />
                                    </div>
                                    <div className='feedback_cardbody'>
                                      <h4>Stephen</h4>
                                      <div className='rating_bx'>
                                        <ul className='rating_list'>
                                          <li>
                                            <Image
                                              src={fullstar}
                                              width={15}
                                              height={15}
                                              alt='star'
                                            />
                                          </li>
                                          <li>
                                            <Image
                                              src={fullstar}
                                              width={15}
                                              height={15}
                                              alt='star'
                                            />
                                          </li>
                                          <li>
                                            <Image
                                              src={fullstar}
                                              width={15}
                                              height={15}
                                              alt='star'
                                            />
                                          </li>
                                          <li>
                                            <Image
                                              src={fullstar}
                                              width={15}
                                              height={15}
                                              alt='star'
                                            />
                                          </li>
                                          <li>
                                            <Image
                                              src={halfstar}
                                              width={15}
                                              height={15}
                                              alt='halfstar'
                                            />
                                          </li>
                                        </ul>
                                        <span className='total_rating'>(4.5)</span>
                                      </div>
                                      <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='feedback_cardbx'>
                                <div className='feedback_cardinner'>
                                  <div className='feedback_cardinner_bx d-flex flex-wrap'>
                                    <div className='avtarbx'>
                                      <Image
                                        src={avtar3}
                                        width={65}
                                        height={65}
                                        alt='avtar1'
                                      />
                                    </div>
                                    <div className='feedback_cardbody'>
                                      <h4>John</h4>
                                      <div className='rating_bx'>
                                        <ul className='rating_list'>
                                          <li>
                                            <Image
                                              src={fullstar}
                                              width={15}
                                              height={15}
                                              alt='star'
                                            />
                                          </li>
                                          <li>
                                            <Image
                                              src={fullstar}
                                              width={15}
                                              height={15}
                                              alt='star'
                                            />
                                          </li>
                                          <li>
                                            <Image
                                              src={fullstar}
                                              width={15}
                                              height={15}
                                              alt='star'
                                            />
                                          </li>
                                          <li>
                                            <Image
                                              src={fullstar}
                                              width={15}
                                              height={15}
                                              alt='star'
                                            />
                                          </li>
                                          <li>
                                            <Image
                                              src={halfstar}
                                              width={15}
                                              height={15}
                                              alt='halfstar'
                                            />
                                          </li>
                                        </ul>
                                        <span className='total_rating'>(4.5)</span>
                                      </div>
                                      <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='feedback_cardbx'>
                                <div className='feedback_cardinner'>
                                  <div className='feedback_cardinner_bx d-flex flex-wrap'>
                                    <div className='avtarbx'>
                                      <Image
                                        src={avtar1}
                                        width={65}
                                        height={65}
                                        alt='avtar1'
                                      />
                                    </div>
                                    <div className='feedback_cardbody'>
                                      <h4>Stephen</h4>
                                      <div className='rating_bx'>
                                        <ul className='rating_list'>
                                          <li>
                                            <Image
                                              src={fullstar}
                                              width={15}
                                              height={15}
                                              alt='star'
                                            />
                                          </li>
                                          <li>
                                            <Image
                                              src={fullstar}
                                              width={15}
                                              height={15}
                                              alt='star'
                                            />
                                          </li>
                                          <li>
                                            <Image
                                              src={fullstar}
                                              width={15}
                                              height={15}
                                              alt='star'
                                            />
                                          </li>
                                          <li>
                                            <Image
                                              src={fullstar}
                                              width={15}
                                              height={15}
                                              alt='star'
                                            />
                                          </li>
                                          <li>
                                            <Image
                                              src={halfstar}
                                              width={15}
                                              height={15}
                                              alt='halfstar'
                                            />
                                          </li>
                                        </ul>
                                        <span className='total_rating'>(4.5)</span>
                                      </div>
                                      <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.</p>
                                    </div>
                                  </div>
                                </div>
                              </div> */}
                            </div>
                          </Col>
                          {/* <Col md={6} lg={5} xxl={4}>
                            <div className='other_notification'>
                              <div className='notif_title divider_bottom'>
                                <h4>Reports</h4>
                              </div>
                              <div className='report_card'>
                                <div className='report_innercard'>
                                  <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages and more recently with desktop publishing</p>
                                  <h5>Stephen</h5>
                                </div>
                                <div className='report_innercard'>
                                  <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages and more recently with desktop publishing</p>
                                  <h5>Stephen</h5>
                                </div>
                                <div className='report_innercard'>
                                  <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages and more recently with desktop publishing</p>
                                  <h5>Stephen</h5>
                                </div>
                                <div className='report_innercard'>
                                  <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages and more recently with desktop publishing</p>
                                  <h5>Stephen</h5>
                                </div>
                              </div>
                            </div>
                          </Col> */}
                        </Row>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              <div>
                {currentRecords.length ? <Pagination
                  nPages={nPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                /> : null}
              </div>
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

export default FeedbacksAndReports
