"use client"
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import styles from '../../../style/dashboard.module.scss';
import Sidemenu from '../../../component/sidemenu/page';
import Headerbar from '../../../component/headerbar/page';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import addicon from 'public/images/add-white.svg';
import doticon from 'public/images/action_dot.svg';
import Searchicon from 'public/images/search_icon.svg';
import Dropdown from 'react-bootstrap/Dropdown';
// import InviteModal from '@/app/Component/Modal/inviteModal/page';
import { getFirestore, collection, getDocs, documentId } from 'firebase/firestore';
import Pagination from '../../../component/pagination/page';
import Badge from "react-bootstrap/Badge";
import ImageLoader from "../../../component/ImageLoader/page";
import DeleteModal from '../../../component/Modal/DeleteModel/page';
import firebase from '../../../../utils/db';
import DatePickerStyles from '../../../component/DatePickerStyles/page';
import { getCookie, deleteCookie } from "cookies-next";
import moment from 'moment';
import useSortableData from '../../../../utils/tableSort/page';
import SwapGroupGrey from "public/images/swap_group_grey.svg";
import sort_up from "public/images/sort_up.svg";
import sort_down from "public/images/sort_down.svg";

const ManageCommittee = () => {
  const [sideShow, setSideShow] = useState(false)
  const [modalShow, setModalShow] = useState(false);
  const [loaderShow, setLoaderShow] = useState(false);
  const [committee, setCommittee] = useState([])
  const [committeeOptn, setCommitteeOptn] = useState("All")
  const [serachCommittee, setSerachCommittee] = useState("");
  const [selectedDocId, setSelectedDocId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(7);
  const [fromDate, setFromDate] = useState()
  const [toDate, setToDate] = useState()

  const router = useRouter()
  const committeeActive = getCookie("committee-active");

  const getCommitteeData = async () => {
    setLoaderShow(true)
    const db = getFirestore();
    const colRef = collection(db, "Committee");
    const docsSnap = await getDocs(colRef);
    let committeeData = []
    docsSnap.forEach(doc => {
      committeeData.push({ docId: doc.id, ...doc.data() })
    })
    committeeData.reverse()
    setCommittee(committeeData)
    setLoaderShow(false)
  }

  const handleSearchCommittee = (event) => {
    setSerachCommittee(event.target.value);
    setCurrentPage(1);
  };

  const committeeData = useMemo(() => {
    if (serachCommittee && fromDate && toDate) {
      return committee.filter(
        (item) => {
          const payOutDate = new Date(item.firstPayOutDate.split("-").reverse().join("-")).getTime();
          return (item.title.toLowerCase().includes(serachCommittee.toLowerCase().trim()) || item.totalAmount.toLowerCase().includes(serachCommittee.toLowerCase().trim()) || item.frequency.toLowerCase().includes(serachCommittee.toLowerCase().trim()) || item.firstPayOutDate.toLowerCase().includes(serachCommittee.toLowerCase().trim())) &&
            (item.status == committeeOptn || committeeOptn === "All") && (payOutDate >= fromDate && payOutDate <= toDate)
        }
      );
    } else if (serachCommittee && fromDate && !toDate) {
      return committee.filter(
        (item) => {
          const payOutDate = new Date(item.firstPayOutDate.split("-").reverse().join("-")).getTime();
          return (item.title.toLowerCase().includes(serachCommittee.toLowerCase().trim()) || item.totalAmount.toLowerCase().includes(serachCommittee.toLowerCase().trim()) || item.frequency.toLowerCase().includes(serachCommittee.toLowerCase().trim()) || item.firstPayOutDate.toLowerCase().includes(serachCommittee.toLowerCase().trim())) &&
            (item.status == committeeOptn || committeeOptn === "All") && (payOutDate >= fromDate)
        }
      );
    } else if (serachCommittee && !fromDate && toDate) {
      return committee.filter(
        (item) => {
          const payOutDate = new Date(item.firstPayOutDate.split("-").reverse().join("-")).getTime();
          return (item.title.toLowerCase().includes(serachCommittee.toLowerCase().trim()) || item.totalAmount.toLowerCase().includes(serachCommittee.toLowerCase().trim()) || item.frequency.toLowerCase().includes(serachCommittee.toLowerCase().trim()) || item.firstPayOutDate.toLowerCase().includes(serachCommittee.toLowerCase().trim())) &&
            (item.status == committeeOptn || committeeOptn === "All") && (payOutDate <= toDate)
        }
      );
    } else if (serachCommittee && !fromDate && !toDate) {
      return committee.filter(
        (item) => {
          return (item.title.toLowerCase().includes(serachCommittee.toLowerCase().trim()) || item.totalAmount.toLowerCase().includes(serachCommittee.toLowerCase().trim()) || item.frequency.toLowerCase().includes(serachCommittee.toLowerCase().trim()) || item.firstPayOutDate.toLowerCase().includes(serachCommittee.toLowerCase().trim())) &&
            (item.status == committeeOptn || committeeOptn === "All")
        }
      );
    } else if (fromDate && toDate) {
      return committee.filter(
        (item) => {
          const payOutDate = new Date(item.firstPayOutDate.split("-").reverse().join("-")).getTime();
          return (payOutDate >= fromDate && payOutDate <= toDate) &&
            (item.status == committeeOptn || committeeOptn === "All")
        })
    } else if (fromDate) {
      return committee.filter(
        (item) => {
          const payOutDate = new Date(item.firstPayOutDate.split("-").reverse().join("-")).getTime();
          return (payOutDate >= fromDate) &&
            (item.status == committeeOptn || committeeOptn === "All")
        })
    } else if (toDate) {
      return committee.filter(
        (item) => {
          const payOutDate = new Date(item.firstPayOutDate.split("-").reverse().join("-")).getTime();
          return (payOutDate <= toDate) &&
            (item.status == committeeOptn || committeeOptn === "All")
        })
    } else if (committeeOptn === "All") {
      return committee;
    } else {
      return committee.filter((item) => item.status == committeeOptn);
    }
  }, [committee, serachCommittee, committeeOptn, fromDate, toDate]);

  // sorting table with name start ------------------>>>
  const { items, requestSort, sortConfig } = useSortableData(committeeData)

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  // sorting table with name end -------------------->>>

  //  Pagination Start ----------------------->>>>>>>>>>>>
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = items.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(items.length / recordsPerPage)
  //  Pagination End ----------------------->>>>>>>>>>>>

  const deletModelShow = async (docId) => {
    setModalShow(true)
    setSelectedDocId(docId)
  }

  const handleDeleteCommittee = () => {
    firebase.firestore().collection("Committee").where(documentId(), "==", selectedDocId).get()
      .then(querySnapshot => {
        querySnapshot?.docs[0]?.ref?.delete();
      });
    firebase.firestore().collection("All_Orders").where(documentId(), "==", selectedDocId).get()
      .then(querySnapshot => {
        querySnapshot?.docs[0]?.ref?.delete();
      });
    firebase.firestore().collection("All_Payments").where(documentId(), "==", selectedDocId).get()
      .then(querySnapshot => {
        querySnapshot?.docs[0]?.ref?.delete();
      });
    firebase.firestore().collection("messages").where(documentId(), "==", selectedDocId).get()
      .then(querySnapshot => {
        querySnapshot?.docs[0]?.ref?.delete();
      });
    firebase.firestore().collection("Committee_Members").where("committee_id", "==", selectedDocId).get()
      .then(querySnapshot => {
        querySnapshot?.docs?.map((item) => {
          item?.ref?.delete();
        })
      });
    firebase.firestore().collection("Notifications").where("committee_id", "==", selectedDocId).get()
      .then(querySnapshot => {
        querySnapshot?.docs?.map((item) => {
          item?.ref?.delete();
        })
      });
    const filterData = committee.reverse().filter((item) => {
      return item.docId !== selectedDocId
    })
    setCommittee(filterData)
    setModalShow(false)
  }

  const handleFromDate = (date) => {
    const dateFrom = moment(date).startOf('day').valueOf();
    setFromDate(dateFrom)
  }

  const handleToDate = (date) => {
    const dateTo = moment(date).endOf('day').valueOf();
    setToDate(dateTo)
  }

  useEffect(() => {
    getCommitteeData()
    if (committeeActive) {
      setCommitteeOptn("Active");
    }
    deleteCookie("committee-active");
  }, [])

  return (
    <>
      <main className={`${styles.main} main_wraper ${sideShow ? 'sidebar_small' : 'sidebar_full'}`}  >
        <div className={`${styles.sidebar} leftsidebar`}>
          <Sidemenu sideShow={sideShow} setSideShow={setSideShow} />
        </div>
        <div className={`${styles.centerwrapper} centerpage`}>
          <div className={`${styles.top_manubar} menubar_toppage sticky_top`}>
            <Headerbar title="Manage Committees" />
          </div>
          <div className={`${styles.page_inner} dashbaord_inner_pagebx`}>
            <div className='managecom_list pt-10 manage_commit_mainbx'>
              <div className='list_title d-flex align-items-center justify-content-between pt-15 flex-wrap'>
                <div className='right_sort topbar-selectbx cstm_rightbox_topbar'>
                  <div className='fillter_mainupper d-flex align-items-center flex-wrap'>
                    <div className='filter_left_one'>
                      <Form.Group className="form_cstm">
                        <Form.Select
                          aria-label="Default select example"
                          className='form-control cursor-pointer'
                          onChange={(e) => {
                            setCommitteeOptn(e.target.value)
                            setCurrentPage(1);
                          }}
                          value={committeeOptn}
                        >
                          <option>All</option>
                          <option>Active</option>
                          <option>Deactive</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className='filter_left_one filter_left_two'>
                      <DatePickerStyles dateClass="cursor-pointer" placeholder="From" handleDate={handleFromDate} />
                    </div>
                    <div className='filter_left_one filter_left_two'>
                      <DatePickerStyles dateClass="cursor-pointer" placeholder="To" handleDate={handleToDate} />
                    </div>
                  </div>
                </div>
                <div className='d-flex m-auto flex-wrap gap_10 searchbx_manage_right'>
                  <div className=" search_bartop">
                    <div className="search_outer">
                      <div className='searchbar_main'>
                        <Form.Control
                          type="text"
                          placeholder="Search..."
                          className="cstm-searchbar"
                          aria-label="Search"
                          onChange={handleSearchCommittee}
                        />
                        <span className='search_icon'>
                          <Image src={Searchicon} alt='search_icon' width={16} height={16} />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='btnlist_group'>
                    <ul className='listing_groupbx'>
                      <li>
                        <Button variant="primary" size="sm" className='btn_icon' onClick={() => router.push('/dashboard/managecommittee/createcommittee')}>
                          <span className='icon_bx'><Image src={addicon} width={13} height={13} alt="addicon" className='me-1' /></span>
                          <span className='btn_tex'> Create Committee</span>
                        </Button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className='table_box'>
                <div className='cstm_table'>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th className='w-20'>
                          <div className={`d-inline-flex sort_box sorting_data`} type="button" onClick={() => requestSort("title")}>
                            <span className='sort_texname'>Name</span>
                            <button
                              className="sort_btn"
                            >
                              {getClassNamesFor("title") == "ascending" ? (
                                <Image
                                  src={sort_up}
                                  alt="sorting_up"
                                  height={10}
                                  width={10}
                                />
                              ) : getClassNamesFor("title") == "descending" ? (
                                <Image
                                  src={sort_down}
                                  alt="sorting_down"
                                  height={10}
                                  width={10}
                                />
                              ) : (
                                <Image
                                  src={SwapGroupGrey}
                                  alt="Swap Group Grey"
                                  height={10}
                                  width={10}
                                />
                              )}
                            </button>
                          </div>
                        </th>
                        <th className="text-center">Amount</th>
                        <th className="text-center">Recurrence</th>
                        <th className="text-center">First Pay-Out Date</th>
                        <th className="text-center">Committee Date</th>
                        <th className="text-center">Status</th>
                        <th className='text-center'>Action</th>
                      </tr>
                    </thead>
                    <tbody className="position-relative">
                      {currentRecords.length ? (currentRecords.map((item, index) => (
                        <tr key={index}>
                          <td
                            className='cursor-pointer'
                            onClick={() => router.push(`/dashboard/managecommittee/${item.docId}`)}>
                            {item.title}
                          </td>
                          <td
                            className="text-center cursor-pointer"
                            onClick={() => router.push(`/dashboard/managecommittee/${item.docId}`)}>
                            {item.totalAmount}
                          </td>
                          <td
                            className="text-center cursor-pointer"
                            onClick={() => router.push(`/dashboard/managecommittee/${item.docId}`)}>
                            {item.frequency}
                          </td>
                          <td
                            className="text-center cursor-pointer"
                            onClick={() => router.push(`/dashboard/managecommittee/${item.docId}`)}>
                            {item.firstPayOutDate}
                          </td>
                          <td
                            className="text-center cursor-pointer"
                            onClick={() => router.push(`/dashboard/managecommittee/${item.docId}`)}>
                            {item?.collectionDate ? item?.collectionDate : '-'}
                          </td>
                          <td
                            className="text-center cursor-pointer"
                            onClick={() => router.push(`/dashboard/managecommittee/${item.docId}`)}>
                            <Badge
                              className="cstm_badge round_badge"
                              bg={
                                item.status === "Active" ? "green" : "red-light"
                              }
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td>
                            <div className='drop_table_btn'>
                              <Dropdown className='cstm_dropdown'>
                                <Dropdown.Toggle variant="success" id="dropdown-basic" className='action_btn_sml'>
                                  <Image src={doticon} alt='doticon' width={4} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  {/* <Dropdown.Item onClick={() => router.push(`/dashboard/managecommittee/${item.docId}`)}>View Details</Dropdown.Item> */}
                                  <Dropdown.Item onClick={() => router.push(`/dashboard/managecommittee/edit/${item.docId}`)}>Edit</Dropdown.Item>
                                  <Dropdown.Item onClick={() => deletModelShow(item.docId)}>Delete</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </td>
                        </tr>
                      ))) : <tr>
                        <td colSpan={7} className="td_spinner text-center">
                          {!loaderShow ? <span className='no_data_tex'>No data found!</span> : <ImageLoader />}
                        </td>
                      </tr>}
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
      {/* invite modal */}
      {/* <InviteModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      /> */}
      <DeleteModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onDelete={handleDeleteCommittee}
      />
    </>
  )
}

export default ManageCommittee
