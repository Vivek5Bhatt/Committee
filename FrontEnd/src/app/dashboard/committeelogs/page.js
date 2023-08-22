"use client"
import { useEffect, useMemo, useState } from 'react';
import styles from '../../../style/dashboard.module.scss';
import Sidemenu from '../../../component/sidemenu/page';
import Headerbar from '../../../component/headerbar/page';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import ImageLoader from '../../../component/ImageLoader/page';
import Pagination from '../../../component/pagination/page';
import moment from 'moment';
import { ExportToCsv } from 'export-to-csv';
import DatePickerStyles from '@/component/DatePickerStyles/page';

const committeelogs = () => {
  const [sideShow, setSideShow] = useState(false)
  const [committee, setCommittee] = useState([])
  const [committeeLogs, setCommitteeLogs] = useState([])
  const [loaderShow, setLoaderShow] = useState(false);
  const [committeeLogsTypeOptn, setcommitteeLogsTypeOptn] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(7);
  const [fromDate, setFromDate] = useState()
  const [toDate, setToDate] = useState()

  const getCommitteeLogs = async () => {
    try {
      setLoaderShow(true);
      const db = getFirestore();
      const committeeRef = collection(db, "Committee");
      const userRef = collection(db, "Users");
      const notifRef = collection(db, "Notifications");
      // const committeeMemberRef = collection(db, "Committee_Members");
      const committeeSnap = await getDocs(committeeRef);
      const userSnap = await getDocs(userRef)
      // const committeeMemberSnap = await getDocs(committeeMemberRef)
      const notifSnap = await getDocs(query(notifRef, orderBy('timestamp', 'desc')))
      let committeeData = []
      let userData = [];
      // let commiteeMemberData = [];
      let committeeLogsData = []
      committeeSnap.forEach(doc => {
        committeeData.push({ docId: doc.id, ...doc.data() })
      })
      userSnap.forEach(doc => {
        userData.push({ docId: doc.id, ...doc.data() })
      })
      // committeeMemberSnap.forEach(doc => {
      //   commiteeMemberData.push({
      //     docId: doc.id, ...doc.data(),
      //   })
      // })
      notifSnap.forEach(doc => {
        committeeLogsData.push({
          docId: doc.id, ...doc.data()
        })
      })
      const allCommitteeLogs = committeeLogsData.map((item) => {
        const findUser = userData.find((data) => data.docId === item.uid[0]);
        const findSender = userData.find((data) => data.docId === item.sendBy)
        const findCommittee = committeeData.find((data) => data.docId === item.committee_id)
        item.name = findUser?.name
        item.sender = findSender?.name
        item.committee = findCommittee
        if (item.type == "comInvite") {
          item.message = `${item.sender} invites ${item.name} to join '${item?.committee?.title}'.`
        } else if (item.type == "comInviteAccept") {
          item.message = `${item.sender} accepts ${item.name} invite request for '${item?.committee?.title}'.`
        } else if (item.type == "payment") {
          item.message = `${item.sender} pays the £${item?.committee?.deposit} successfully for '${item?.committee?.title}'.`
        } else if (item.type == "swap") {
          item.message = `${item.sender} sent swap request to ${item.name} for '${item?.committee?.title}'`
        } else if (item.type == 'swapAccept') {
          item.message = `${item.sender} accepts ${item.name} swap request for '${item?.committee?.title}'.`
        } else if (item.type == "swapReject") {
          item.message = `${item.sender} decline ${item.name} swap request for '${item?.committee?.title}'.`
        } else if (item.type == "comInviteReject") {
          item.message = `${item.sender} decline ${item.name} invite request for '${item?.committee?.title}'.`
        }
        setCommittee(prev => [...prev, {
          Year: moment(item.timestamp).format("YYYY"),
          Month: moment(item.timestamp).format("MMMM"),
          Date: moment(item.timestamp).format("DD"),
          Time: moment(item.timestamp).format("hh:mm a"),
          [`Committee Name`]: item?.committee?.title ? item?.committee?.title : '-',
          [`Created By`]: item.sender,
          [`Activity Type`]: committeeLogsType(item.type),
          [`Activity Detail`]: item.message,
        }])
        return {
          Timestamp: item.timestamp,
          Year: moment(item.timestamp).format("YYYY"),
          Month: moment(item.timestamp).format("MMMM"),
          Date: moment(item.timestamp).format("DD"),
          Time: moment(item.timestamp).format("hh:mm a"),
          [`Committee Name`]: item?.committee?.title ? item?.committee?.title : '-',
          [`Created By`]: item.sender,
          [`Activity Type`]: committeeLogsType(item.type),
          [`Activity Detail`]: item.message,
        }
      });
      setCommitteeLogs(allCommitteeLogs)
      setLoaderShow(false);
    } catch (error) {
      return error
    }
  }

  const committeeLogsType = (type) => {
    if (type == "comInvite") {
      return "Invitation Sent"
    } else if (type == 'comInviteAccept') {
      return 'Invitation Accepted'
    } else if (type == 'payment') {
      return "Payment Successful"
    } else if (type == 'swap') {
      return 'Swap Order Sent'
    } else if (type == 'swapAccept') {
      return 'Swap Request Accepted'
    } else if (type == 'swapReject') {
      return 'Swap Request Rejected'
    } else if (type == 'comInviteReject') {
      return 'Invitation Rejected'
    }
  }

  const committeeLogsData = useMemo(() => {
    if (fromDate && toDate) {
      return committeeLogs.filter(
        (item) => {
          const payOutDate = item.Timestamp
          return (payOutDate >= fromDate && payOutDate <= toDate) &&
            (item['Activity Type'] == committeeLogsTypeOptn || committeeLogsTypeOptn === "All")
        })
    } else if (fromDate) {
      return committeeLogs.filter(
        (item) => {
          const payOutDate = item.Timestamp
          return (payOutDate >= fromDate) &&
            (item['Activity Type'] == committeeLogsTypeOptn || committeeLogsTypeOptn === "All")
        })
    } else if (toDate) {
      return committeeLogs.filter(
        (item) => {
          const payOutDate = item.Timestamp
          return (payOutDate <= toDate) &&
            (item['Activity Type'] == committeeLogsTypeOptn || committeeLogsTypeOptn === "All")
        })
    } else if (committeeLogsTypeOptn === "All") {
      return committeeLogs
    } else {
      return committeeLogs.filter((item) => item['Activity Type'] == committeeLogsTypeOptn);
    }
  }, [committeeLogs, committeeLogsTypeOptn, fromDate, toDate]);

  //  Pagination Start ----------------------->>>>>>>>>>>>
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = (indexOfLastRecord - recordsPerPage);
  const currentRecords = committeeLogsData?.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(committeeLogsData?.length / recordsPerPage)
  //  Pagination End ----------------------->>>>>>>>>>>>

  // To Generate Committee Activity Log Excel Start---------->>>>
  const options = {
    filename: 'Committee Activity Log',
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: false,
    title: '',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    // headers:  ['Year', 'Month', 'Date', 'Time' , 'Created By',' Activity Type', `Activity Detail`]
  };
  const csvExporter = new ExportToCsv(options);
  // To Generate Committee Activity Log Excel End ---------->>>>

  useEffect(() => {
    getCommitteeLogs()
  }, [])

  const handleFromDate = (date) => {
    const dateFrom = moment(date).startOf('day').valueOf();
    setFromDate(dateFrom)
  }

  const handleToDate = (date) => {
    const dateTo = moment(date).endOf('day').valueOf();
    setToDate(dateTo)
  }

  return (
    <>
      <main className={`${styles.main} main_wraper ${sideShow ? 'sidebar_small' : 'sidebar_full'}`}  >
        <div className={`${styles.sidebar} leftsidebar`}>
          <Sidemenu sideShow={sideShow} setSideShow={setSideShow} />
        </div>
        <div className={`${styles.centerwrapper} centerpage`}>
          <div className={`${styles.top_manubar} menubar_toppage sticky_top`}>
            <Headerbar title="Committee Activity Logs" />
          </div>
          <div className={`${styles.page_inner} dashbaord_inner_pagebx`}>
            <div className='managecom_list payment_manage pt-10 manage_payment_mainbx'>
              <div className='list_title d-flex align-items-center justify-content-between pt-15 flex-wrap'>
                <div className='right_sort topbar-selectbx left_dropbox_main'>
                  <div className='fillter_log_main fillter_mainupper d-flex align-items-center flex-wrap'>
                    <div className='filter_left_one filter_left_two filter_lg'>
                      <Form.Group className="form_cstm">
                        <Form.Select
                          aria-label="Default select example"
                          className='form-control'
                          onChange={(e) => {
                            setcommitteeLogsTypeOptn(e.target.value)
                            setCurrentPage(1);
                          }}>
                          <option disabled selected={committeeLogsTypeOptn === "All"}>Select Type</option>
                          <option>All</option>
                          <option>Invitation Sent</option>
                          <option>Invitation Accepted</option>
                          <option>Payment Successful</option>
                          <option>Swap Order Sent</option>
                          <option>Swap Request Accepted</option>
                          <option>Swap Request Rejected</option>
                          <option>Invitation Rejected</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className='filter_left_one filter_left_two'>
                      <DatePickerStyles placeholder="From" handleDate={handleFromDate} />
                    </div>
                    <div className='filter_left_one filter_left_two'>
                      <DatePickerStyles placeholder="To" handleDate={handleToDate} />
                    </div>
                  </div>
                </div>
                <div className='btnlist_group'>
                  <ul className='listing_groupbx'>
                    <li>
                      {
                        currentRecords?.length ? <Button variant="primary" size="sm" className='btn_icon' onClick={() => csvExporter.generateCsv(committeeLogsData)}>
                          Export
                        </Button> : <Button variant="primary" size="sm" className='btn_icon'> Export </Button>
                      }
                    </li>
                  </ul>
                </div>
              </div>
              <div className='table_box'>
                <div className='cstm_table'>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th className='text-center'>Month</th>
                        <th className='text-center'>Date</th>
                        <th className='text-center'>Time</th>
                        <th className='text-center'>Committee Name</th>
                        <th className='text-center'>Created By</th>
                        <th className='text-center'>Activity Type</th>
                        <th className=' w-26 min-w180'>Activity Detail</th>
                      </tr>
                    </thead>
                    <tbody className="position-relative">
                      {
                        currentRecords?.length ?
                          (currentRecords?.map((item, index) => (
                            <tr key={index}>
                              <td>{item.Year}</td>
                              <td className='text-center'>{item.Month}</td>
                              <td className='text-center'>{item.Date}</td>
                              <td className='text-center'>{item.Time}</td>
                              <td className='text-center'>{item[`Committee Name`] ? item[`Committee Name`] : '-'}</td>
                              <td className='text-center'>{item[`Created By`]}</td>
                              <td className='text-center'>{item[`Activity Type`]}</td>
                              <td>{item[`Activity Detail`]}</td>
                            </tr>
                          )))
                          :
                          (
                            <tr>
                              <td colSpan={8} className="td_spinner text-center">
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
                  {
                    currentRecords?.length ?
                      <Pagination
                        nPages={nPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                      /> : null
                  }
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

export default committeelogs
