"use client"
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import styles from '../../../style/dashboard.module.scss';
import Sidemenu from '../../../component/sidemenu/page';
import Headerbar from '../../../component/headerbar/page';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import doticon from 'public/images/action_dot.svg';
import Badge from 'react-bootstrap/Badge';
import Dropdown from 'react-bootstrap/Dropdown';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import ImageLoader from '../../../component/ImageLoader/page';
import Pagination from '../../../component/pagination/page';
import Searchicon from "public/images/search_icon.svg";
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/navigation';

const ManagePayment = () => {
  const [sideShow, setSideShow] = useState(false)
  const [payment, setPayment] = useState([])
  const [loaderShow, setLoaderShow] = useState(false);
  const [paymentOptn, setPaymentOptn] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(7);
  const [serachPayment, setSerachPayment] = useState("");
  const router = useRouter();

  const getPaymentData = async () => {
    try {
      setLoaderShow(true);
      const db = getFirestore();
      const committeeRef = collection(db, "Committee");
      const userRef = collection(db, "Users");
      const committeeMemberRef = collection(db, "Committee_Members");
      const committeeSnap = await getDocs(committeeRef);
      const userSnap = await getDocs(userRef)
      const committeeMemberSnap = await getDocs(committeeMemberRef)
      let committeeData = []
      let userData = [];
      let commiteeMemberData = [];
      committeeSnap.forEach(doc => {
        committeeData.push({ docId: doc.id, ...doc.data() })
      })
      userSnap.forEach(doc => {
        userData.push({ docId: doc.id, ...doc.data() })
      })
      committeeMemberSnap.forEach(doc => {
        commiteeMemberData.push({
          docId: doc.id, ...doc.data(),
        })
      })
      const finalCommitteeMember = commiteeMemberData.sort(function (a, b) {
        const x = a.created_at
        const y = b.created_at
        return (y - x)
      }).filter((item) => {
        if (item?.uid) {
          return true;
        } else {
          return false;
        }
      })
        .map(async (item) => {
          const allPaymentRef = collection(db, "All_Payments", item.committee_id, "Payments");
          const allPaymentSnap = await getDocs(allPaymentRef)
          let allPaymentData = [];
          allPaymentSnap.forEach(doc => {
            allPaymentData.push({
              docId: doc.id, ...doc.data(),
            })
          })
          const committee = committeeData.find((i) => i.docId == item.committee_id)
          const user = userData.find((i) => i.uid == item.uid)
          const order = await getOrder(item.committee_id)
          const committeeMemberOrder = order.find((i) => i.uid == item.uid)
          const payment = allPaymentData && allPaymentData.find((i) => i.uid === item.uid)
          return { ...item, committee, user, committeeMemberOrder, payment }
        })
      const allData = await Promise.all(finalCommitteeMember);
      const filterData = allData.filter(item => item.committee)
      setPayment(filterData)
      setLoaderShow(false);
    } catch (error) {
      return error
    }
  }

  const getOrder = async (id) => {
    try {
      const orderData = []
      const db = getFirestore()
      const newCollectionRef = collection(db, 'All_Orders', id, 'Orders')
      const docsSnap = await getDocs(newCollectionRef)
      docsSnap.forEach(doc => {
        const obj = doc.data()
        orderData.push({ ...obj })
      })
      return orderData
    } catch (error) {
      return error
    }
  }

  const handleSearchPayment = (event) => {
    setSerachPayment(event.target.value);
    setCurrentPage(1);
  };

  const paymentData = useMemo(() => {
    if (serachPayment) {
      return payment
        .filter(
          (item) =>
            (item?.user?.name.toLowerCase().includes(serachPayment.toLowerCase().trim()) ||
              item?.committee?.title.toLowerCase().includes(serachPayment.toLowerCase().trim()) ||
              item?.committeeMemberOrder?.due_date.toLowerCase().includes(serachPayment.toLowerCase().trim()) ||
              item?.committee?.totalAmount.toLowerCase().includes(serachPayment.toLowerCase().trim())) &&
            (item.payment_status == paymentOptn || paymentOptn === "All")
        );
    } else if (paymentOptn === "All") {
      return payment;
    } else {
      return payment.filter((item) => item.payment_status == paymentOptn);
    }
  }, [payment, serachPayment, paymentOptn]);

  //  Pagination Start ----------------------->>>>>>>>>>>>
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = (indexOfLastRecord - recordsPerPage);
  const currentRecords = paymentData?.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(paymentData.length / recordsPerPage)
  //  Pagination End ----------------------->>>>>>>>>>>>

  useEffect(() => {
    getPaymentData()
  }, [])

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
            <div className='managecom_list payment_manage pt-10 manage_payment_mainbx'>
              <div className='list_title d-flex align-items-center justify-content-between pt-15 flex-wrap'>
                <div className='right_sort topbar-selectbx left_dropbox_main'>
                  <Form.Group className="form_cstm">
                    <Form.Select
                      aria-label="Default select example"
                      className='form-control'
                      onChange={(e) => {
                        setPaymentOptn(e.target.value)
                        setCurrentPage(1);
                      }}>
                      <option>All</option>
                      <option>Unpaid</option>
                      <option>Paid</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="d-flex m-auto search_bartop">
                  <div className="search_outer">
                    <div className="searchbar_main">
                      <Form.Control
                        type="text"
                        placeholder="Search..."
                        className="cstm-searchbar"
                        aria-label="Search"
                        onChange={handleSearchPayment}
                      />
                      <span className="search_icon">
                        <Image
                          src={Searchicon}
                          alt="search_icon"
                          width={16}
                          height={16}
                        />
                      </span>
                    </div>
                  </div>
                </div>

                <div className='btnlist_group'>
                  <ul className='listing_groupbx'>
                    <li>
                      <Button variant="primary" size="sm" className='btn_icon' onClick={() => router.push('/dashboard/managepayment/carddetails')}>
                        Card Details
                      </Button>
                    </li>
                  </ul>
                </div>

              </div>
              <div className='table_box'>
                <div className='cstm_table'>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th className='w-15'>Name</th>
                        <th className='text-center'>Committee Name</th>
                        <th className='text-center'>Amount</th>
                        <th className='text-center'>Payment Date</th>
                        <th className='text-center'>Status</th>
                        {/* <th className='text-center'>Action</th> */}
                      </tr>
                    </thead>
                    <tbody className="position-relative">
                      {currentRecords.length ?
                        (currentRecords?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item?.user?.name}</td>
                              <td className='text-center'>{item?.committee?.title}</td>
                              <td className='text-center'>{item?.committee?.totalAmount}</td>
                              <td className='text-center'>{item?.payment?.date ? item?.payment?.date : '-'}</td>
                              <td className='text-center'> <Badge className='cstm_badge round_badge' bg={
                                item.payment_status === "Paid" ? "green" : "red-light"
                              }>{item.payment_status}</Badge></td>
                              {/* <td>
                              <div className='drop_table_btn'>
                                <Dropdown className='cstm_dropdown'>
                                  <Dropdown.Toggle variant="success" id="dropdown-basic" className='action_btn_sml'>
                                    <Image src={doticon} alt='doticon' width={4} />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">Recieved</Dropdown.Item>
                                    <Dropdown.Item href="#/action-1">Pending</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </td> */}
                            </tr>
                          )
                        })) :
                        (
                          <tr>
                            <td colSpan={6} className="td_spinner text-center">
                              {!loaderShow ? (
                                <span className="no_data_tex">
                                  No data found!
                                </span>
                              ) : (
                                <ImageLoader />
                              )}
                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
                  {/* *************************************** */}
                  {currentRecords.length ? <Pagination
                    nPages={nPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  /> : null}
                </div>
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

export default ManagePayment
