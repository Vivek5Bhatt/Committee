"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../../../../style/dashboard.module.scss";
import Sidemenu from "../../../../component/sidemenu/page";
import Headerbar from "../../../../component/headerbar/page";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import avtar1 from "public/images/avtar1.svg";
import { useParams } from "next/navigation";
import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import Button from "react-bootstrap/Button";
import moment from "moment";
import ImageLoader from "../../../../component/ImageLoader/page";
import paidIcon from "public/images/tick_white.svg";
import unPaidIcon from "public/images/uncheck.svg";
import pount_sign from "public/images/pount_sign.svg";
import pendingIcon from "public/images/user_timer.svg";
import { Table } from "react-bootstrap";
import CheckIcon from "public/images/check.svg";
import Payment from "public/images/payment_white.svg";
import commitee_create from "public/images/commitee_create.svg";
import invitation from "public/images/invitation-white.svg";
import Swap from "public/images/swap_white.svg";
import rejectSwap from "public/images/reject_white.svg";
import acceptSwap from "public/images/accept_white.svg";
import UncheckIcon from "public/images/uncheck.svg";
import DatePickerStyles from "@/component/DatePickerStyles/page";
import backIcon from 'public/images/backArrow.svg';
import DeleteModal from "@/component/Modal/DeleteModel/page";
import RestartModal from "@/component/Modal/RestartModal/page";
import ActiveModal from "@/component/Modal/ActiveModal/page";
// import Form from 'react-bootstrap/Form';
// import InviteNewUser from '../../../../component/inviteNewUser/page';
// import DatePickerStyles from '../../../../component/DatePickerStyles/page';
// import Searchicon from 'public/images/search_icon.svg';

const ViewDetail = () => {
  const [modalShow, setModalShow] = useState(false);
  const [restartModalShow, setRestartModalShow] = useState(false)
  const [activeModalShow, setActiveModalShow] = useState(false)
  const [loaderShow, setLoaderShow] = useState(false);
  const [sideShow, setSideShow] = useState(false);
  const [userData, setUserData] = useState([]);
  const [committee, setCommittee] = useState({});
  const [committeMemberData, setCommitteeMemberData] = useState([]);
  const [committeHistoryData, setCommitteeHistoryData] = useState([]);
  const [isCycleCompleted, setIsCycleCompleted] = useState(false)
  const [order, setOrder] = useState([]);
  const router = useRouter();
  const params = useParams();
  const id = params.detail;
  // committee history logs-------------------->>>>>>>
  const [historyLogs, setHistoryLogs] = useState([])
  const [startDate, setStartDate] = useState();
  // get all user data -------------------->>>

  const getUserData = async () => {
    try {
      const db = getFirestore();
      const colRef = collection(db, "Users");
      const docsSnap = await getDocs(colRef);
      let userData = [];
      docsSnap.forEach((doc) => {
        userData.push({ docId: doc.id, ...doc.data() });
      });
      setUserData(userData);
      return userData;
    } catch (error) {
      return error;
    }
  };

  // get all Committee Member Data------------->
  const getCommitteeMemberData = async () => {
    const db = getFirestore();
    const colRef = collection(db, "Committee_Members");
    const docsSnap = await getDocs(colRef);
    let committeeMemberData = [];
    docsSnap.forEach((doc) => {
      committeeMemberData.push({ docId: doc.id, ...doc.data() });
    });
    setCommitteeMemberData(committeeMemberData);
  };

  // get all committee------>
  const getCommitteeData = async () => {
    const db = getFirestore();
    const colRef = collection(db, "Committee");
    const docsSnap = await getDocs(colRef);
    let committeeData = [];
    docsSnap.forEach((doc) => {
      committeeData.push({ docId: doc.id, ...doc.data() });
    });
    const userArr = await getUserData();
    const committee = committeeData.find((item) => {
      const findUser = userArr.find((data) => data.docId === item.uid);
      if (item.docId == id) {
        item.adminName = findUser?.name;
        return item;
      }
    });
    setCommittee(committee);
    return committee;
  };

  const getCommitteeHistoryLogs = async () => {
    setLoaderShow(true)
    const db = getFirestore();
    const notifRef = collection(db, "Notifications");
    const notifSnap = await getDocs(notifRef);
    let committeeHistoryData = [];
    notifSnap.forEach((doc) => {
      committeeHistoryData.push({ docId: doc.id, ...doc.data() });
    });
    const userData = await getUserData()
    const data = await getCommitteeData();
    const committeeHistory = committeeHistoryData.filter((item) => {
      const findUser = userData.find((data) => data.docId === item.uid[0]);
      const findSender = userData.find((data) => data.docId === item.sendBy)
      if (item.committee_id === id) {
        item.committee = data;
        item.name = findUser?.name
        item.sender = findSender?.name
        if (item.type == "comInviteAccept") {
          item.message = <><b>{item.sender}</b> accepts the invitation to join <b>'{item.committee.title}'</b>.</>
        } else if (item.type == "payment") {
          item.message = <><b>{item.sender}</b> pays the <strong className="d-inline-flex align-items-center value_position"><span className="imgbx"> <Image src={pount_sign} width={12} height={12} /></span> <span className="value_num">{item?.committee?.deposit}</span></strong> successfully for <b>'{item.committee.title}'</b>.</>
        } else if (item.type == "swap") {
          item.message = <><b>{item.sender}</b> sent swap request to <b>{item.name}</b> for <b>'{item.committee.title}'</b>.</>
        } else if (item.type == 'swapAccept') {
          item.message = <><b>{item.sender}</b> accepts <b>{item.name}'s</b> swap request for <b>'{item.committee.title}'</b>.</>
        } else if (item.type == "swapReject") {
          item.message = <><b>{item.sender}</b> declines <b>{item.name}'s</b> swap request for <b>'{item.committee.title}'</b>.</>
        }
        return item;
      }
    });
    setCommitteeHistoryData(committeeHistory);
    setHistoryLogs(committeeHistory)
    setLoaderShow(false)
  };

  // get all the committee members with same committee docID------>>>>
  const activeCommitteeMember = [];
  const pendingCommitteeMember = [];

  const committeeMembers = committeMemberData.filter((item) => item.committee_id == id);

  const memberUsers = userData.filter((item) => {
    const committeeMemberUid = committeeMembers.find((i) => i.uid === item.uid);
    const individualOrder = order.find((i) => i.uid === item.uid);
    if (committeeMemberUid?.uid == item.uid) {
      item.payOutDate = individualOrder?.due_date;
      item.payment_status = committeeMemberUid.paymentStatus;
      item.invite_status = committeeMemberUid.invite_status;
      return item;
    }
  });

  committeMemberData.filter((item) => {
    if (item.committee_id == id) {
      if (item.invite_status == "Accept") {
        activeCommitteeMember.push({
          uid: item.uid,
          paymentStatus: item.payment_status,
          invite_status: item.invite_status,
          committee_id: item.committee_id,
        });
      }
      if (item.invite_status == "Pending") {
        pendingCommitteeMember.push({
          uid: item.uid,
          paymentStatus: item.payment_status,
          invite_status: item.invite_status,
          committee_id: item.committee_id,
        });
      }
    }
  });

  // get all the committee Orders---------------->>
  const getOrder = async () => {
    const db = getFirestore();
    const newCollectionRef = collection(db, "All_Orders", id, "Orders");
    const docsSnap = await getDocs(newCollectionRef);
    docsSnap.forEach((doc) => {
      setOrder((prev) => [...prev, doc.data()]);
    });
  };

  const getCycleStatus = () => {
    const currentDateTimestamp = moment(new Date()).toDate().getTime();
    const lastDueDate = order.sort(function (a, b) {
      const x = moment(a.due_date, "DD/MM/YYYY").toDate().getTime();
      const y = moment(b.due_date, "DD/MM/YYYY").toDate().getTime();
      return y - x;
    })[0]?.due_date

    if (lastDueDate) {
      const lastDueDateTimestamp = moment(lastDueDate, "DD/MM/YYYY").toDate().getTime()
      if (lastDueDateTimestamp < currentDateTimestamp) {
        setIsCycleCompleted(true)
      } else {
        setIsCycleCompleted(false)
      }
    }
  }

  useEffect(() => {
    getCycleStatus()
  }, [order])



  // get all the member Users--------------->>>
  const activeMemberUsers = userData.filter((item) => {
    const activeCommitteeMemberUid = activeCommitteeMember.find(
      (i) => i.uid === item.uid
    );
    const individualOrder = order.find((i) => i.uid === item.uid);
    if (activeCommitteeMemberUid?.uid == item.uid) {
      item.payOutDate = individualOrder?.due_date;
      item.payment_status = activeCommitteeMemberUid.paymentStatus;
      item.invite_status = activeCommitteeMemberUid.invite_status;
      return item;
    }
  });

  const pendingMemberUsers = userData.filter((item) => {
    const pendingCommitteeMemberUid = pendingCommitteeMember.find(
      (i) => i.uid === item.uid
    );
    const individualOrder = order.find((i) => i.uid === item.uid);
    if (pendingCommitteeMemberUid?.uid == item.uid) {
      item.payOutDate = individualOrder?.due_date;
      item.payment_status = pendingCommitteeMemberUid.paymentStatus;
      item.invite_status = pendingCommitteeMemberUid.invite_status;
      return item;
    }
  });

  useEffect(() => {
    const filterData = committeHistoryData.sort(function (a, b) {
      const x = a.timestamp
      const y = b.timestamp
      return y - x;
    }).filter((item) => {
      if (startDate) {
        const date = moment(item.timestamp).format("MMM YYYY");
        const date1 = moment(startDate).format("MMM YYYY");
        if (date == date1) {
          return item;
        }
      } else {
        return item
      }
    });
    setHistoryLogs(filterData)
  }, [committeHistoryData, startDate]);

  useEffect(() => {
    getCommitteeData();
    getCommitteeMemberData();
    getUserData();
    getOrder();
    getCommitteeHistoryLogs();
  }, []);


  // Handle Restart and Deactivate Start --------------->>>>>>>>>>>>

  const deletModelShow = async (docId) => {
    setModalShow(true)
  }

  const handleDeleteDeactivate = () => {
    const db = getFirestore()
    const docRef = doc(db, "Committee", id);
    const data = {
      status: "Deactivate"
    }
    updateDoc(docRef, data)
      .then(() => {
        router.push("/dashboard/managecommittee")
      })
      .catch(error => {
        return error
      })

  }

  const handleActivateCommittee = () => {

    const db = getFirestore()
    const docRef = doc(db, "Committee", id);
    const data = {
      status: "Active"
    }
    updateDoc(docRef, data)
      .then(() => {
        router.push("/dashboard/managecommittee")
      })
      .catch(error => {
        return error
      })
  }

  // Handle Restart and Deactivate End ------------------->>>>>>>>>>>>
  return (
    <>
      {
        <main
          className={`${styles.main} main_wraper ${sideShow ? "sidebar_small" : "sidebar_full"
            }`}
        >
          <div className={`${styles.sidebar} leftsidebar`}>
            <Sidemenu sideShow={sideShow} setSideShow={setSideShow} />
          </div>
          <div className={`${styles.centerwrapper} centerpage`}>
            <div className={`${styles.top_manubar} menubar_toppage sticky_top`}>
              <Headerbar title="Committee Details" />
            </div>
            <div className={`${styles.page_inner} dashbaord_inner_pagebx`}>
              <div className="managecom_list pt-10">
                <Card className="cstmcard create_commit_bx">
                  <Card.Body>
                    <div className="card_subtitle">
                      <div className="carddetail_head divider_bx pb-20 d-flex align-items-center justify-content-between flex-wrap">
                        <div className="cardbox1">
                          <h3 className="fs-18 fw-500 secondary_color d-flex">
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
                            Details
                          </h3>
                        </div>
                        {
                          isCycleCompleted ?
                            <>
                              <div className="cardbox2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="btn_icon mr-6"
                                  onClick={() => {
                                    setRestartModalShow(true);
                                  }}
                                >
                                  <span className="btn_tex"> Restart</span>
                                </Button>
                                {
                                  committee?.status == 'Active' ?
                                    <Button
                                      size="sm"
                                      className="btn_icon rd-8 bg-DeactivateCommittee"
                                      onClick={() => deletModelShow()}
                                    >
                                      <span className="btn_tex">Deactivate</span>
                                    </Button>
                                    :
                                    <Button
                                      size="sm"
                                      className="btn_icon rd-8 bg-ActivateCommittee"
                                      onClick={() => setActiveModalShow(true)}
                                    >
                                      <span className="btn_tex">Activate</span>
                                    </Button>
                                }
                              </div>
                            </>
                            :
                            null
                        }
                      </div>
                      <div className="addd_form position-relative min_h100">
                        <div className="viewbox_group">
                          {Object.keys(committee)?.length ? (
                            <Row>
                              <Col md={5}>
                                <div className="md_form_box full_box-xxl">
                                  <div className="view_detail_box">
                                    <div className="view_detail_outerbxx">
                                      <Row className="gutter_sml">
                                        <Col
                                          xs={4}
                                          sm={4}
                                          md={5}
                                          lg={5}
                                          className="box1"
                                        >
                                          <div className="user_label">
                                            Committee Name :
                                          </div>
                                        </Col>
                                        <Col
                                          xs={8}
                                          sm={8}
                                          md={7}
                                          lg={7}
                                          className="box2"
                                        >
                                          <div className="user_detail_list">
                                            {committee.title}
                                          </div>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="view_detail_outerbxx">
                                      <Row className="gutter_sml">
                                        <Col
                                          xs={4}
                                          sm={4}
                                          md={5}
                                          lg={5}
                                          className="box1"
                                        >
                                          <div className="user_label">
                                            Committee Admin :
                                          </div>
                                        </Col>
                                        <Col
                                          xs={8}
                                          sm={8}
                                          md={7}
                                          lg={7}
                                          className="box2"
                                        >
                                          <div className="user_detail_list">
                                            {committee.adminName}
                                          </div>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="view_detail_outerbxx">
                                      <Row className="gutter_sml">
                                        <Col
                                          xs={4}
                                          sm={4}
                                          md={5}
                                          lg={5}
                                          className="box1"
                                        >
                                          <div className="user_label">
                                            Deposit Amount:
                                          </div>
                                        </Col>
                                        <Col
                                          xs={8}
                                          sm={8}
                                          md={7}
                                          lg={7}
                                          className="box2"
                                        >
                                          <div className="user_detail_list">
                                            {committee.totalAmount ? committee.totalAmount : 0}
                                          </div>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="view_detail_outerbxx">
                                      <Row className="gutter_sml">
                                        <Col
                                          xs={4}
                                          sm={4}
                                          md={5}
                                          lg={5}
                                          className="box1"
                                        >
                                          <div className="user_label">
                                            Deposited Amount :
                                          </div>
                                        </Col>
                                        <Col
                                          xs={8}
                                          sm={8}
                                          md={7}
                                          lg={7}
                                          className="box2"
                                        >
                                          <div className="user_detail_list">
                                            {committee.totalDepositPayout ? committee.totalDepositPayout : 0}
                                          </div>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="view_detail_outerbxx">
                                      <Row className="gutter_sml">
                                        <Col
                                          xs={4}
                                          sm={4}
                                          md={5}
                                          lg={5}
                                          className="box1"
                                        >
                                          <div className="user_label">
                                            Frequency :
                                          </div>
                                        </Col>
                                        <Col
                                          xs={8}
                                          sm={8}
                                          md={7}
                                          lg={7}
                                          className="box2"
                                        >
                                          <div className="user_detail_list">
                                            {committee.frequency}
                                          </div>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="view_detail_outerbxx">
                                      <Row className="gutter_sml">
                                        <Col
                                          xs={4}
                                          sm={4}
                                          md={5}
                                          lg={5}
                                          className="box1"
                                        >
                                          <div className="user_label">
                                            Members :
                                          </div>
                                        </Col>
                                        <Col
                                          xs={8}
                                          sm={8}
                                          md={7}
                                          lg={7}
                                          className="box2"
                                        >
                                          <div className="user_detail_list">
                                            {committee.members}
                                          </div>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="view_detail_outerbxx">
                                      <Row className="gutter_sml">
                                        <Col
                                          xs={4}
                                          sm={4}
                                          md={5}
                                          lg={5}
                                          className="box1"
                                        >
                                          <div className="user_label">
                                            Committee Date:
                                          </div>
                                        </Col>
                                        <Col
                                          xs={8}
                                          sm={8}
                                          md={7}
                                          lg={7}
                                          className="box2"
                                        >
                                          <div className="user_detail_list">
                                            {committee.collectionDate}
                                          </div>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="view_detail_outerbxx">
                                      <Row className="gutter_sml">
                                        <Col
                                          xs={4}
                                          sm={4}
                                          md={5}
                                          lg={5}
                                          className="box1"
                                        >
                                          <div className="user_label">
                                            Next Pay-Out Date:
                                          </div>
                                        </Col>
                                        <Col
                                          xs={8}
                                          sm={8}
                                          md={7}
                                          lg={7}
                                          className="box2"
                                        >
                                          <div className="user_detail_list">
                                            {committee.nextPayoutDate}
                                          </div>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="view_detail_outerbxx">
                                      <Row className="gutter_sml">
                                        <Col
                                          xs={4}
                                          sm={4}
                                          md={5}
                                          lg={5}
                                          className="box1"
                                        >
                                          <div className="user_label">
                                            Status :
                                          </div>
                                        </Col>
                                        <Col
                                          xs={8}
                                          sm={8}
                                          md={7}
                                          lg={7}
                                          className="box2"
                                        >
                                          <div className="user_detail_list">
                                            {committee.status}
                                          </div>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="view_detail_outerbxx">
                                      <Row className="gutter_sml">
                                        <Col
                                          xs={4}
                                          sm={4}
                                          md={5}
                                          lg={5}
                                          className="box1"
                                        >
                                          <div className="user_label">
                                            Created Date:
                                          </div>
                                        </Col>
                                        <Col
                                          xs={8}
                                          sm={8}
                                          md={7}
                                          lg={7}
                                          className="box2"
                                        >
                                          <div className="user_detail_list">
                                            {moment(
                                              committee?.timestamp
                                            ).format("DD-MM-YYYY")}{" "}
                                          </div>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="view_detail_outerbxx">
                                      <Row className="gutter_sml">
                                        <Col
                                          xs={4}
                                          sm={4}
                                          md={3}
                                          lg={3}
                                          className="box1"
                                        >
                                          <div className="user_label">
                                            Uid :
                                          </div>
                                        </Col>
                                        <Col
                                          xs={8}
                                          sm={8}
                                          md={9}
                                          lg={9}
                                          className="box2"
                                        >
                                          <div className="user_detail_list">
                                            {committee.uid}
                                          </div>
                                        </Col>
                                      </Row>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col md={7}>
                                <div className="rightcard_listview rightcard_listview_bg box_full">
                                  <h3 className="fs-18 fw-500 secondary_color text-center pb-2">
                                    Committee Order
                                  </h3>
                                  <div className="right_card_greybx user_scrolbx max_h340">
                                    {/* table box */}
                                    <div className="table_box view_table_cstmbx">
                                      <div className="cstm_table">
                                        <Table responsive>
                                          <thead>
                                            <tr>
                                              <th>User</th>
                                              <th className="text-center">Pay-Out Date</th>
                                              <th className="text-center">Status</th>
                                              <th className="text-center">Paid Lump-Sum</th>
                                            </tr>
                                          </thead>
                                          <tbody className="position-relative">
                                            {memberUsers.length > 0 ?
                                              memberUsers
                                                .sort(function (a, b) {
                                                  const x = moment(
                                                    a.payOutDate,
                                                    "DD/MM/YYYY"
                                                  )
                                                    .toDate()
                                                    .getTime();
                                                  const y = moment(
                                                    b.payOutDate,
                                                    "DD/MM/YYYY"
                                                  )
                                                    .toDate()
                                                    .getTime();
                                                  return x - y;
                                                })
                                                .map((i, index) => (
                                                  <tr key={index}>
                                                    <td className="view_user_th">
                                                      <div className="notification_cardbx viewdt_table_list d-flex align-items-center">
                                                        <div className="notification_profile">
                                                          <div className="notification_avtar">
                                                            <Image
                                                              src={
                                                                i.image
                                                                  ? i.image
                                                                  : avtar1
                                                              }
                                                              width={40}
                                                              height={40}
                                                              alt={
                                                                i.name
                                                                  ? i.name
                                                                  : "Avtar 1"
                                                              }
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="notification_contentbx text-truncate">
                                                          <h4 className="text-truncate">
                                                            {i.name}
                                                          </h4>
                                                        </div>
                                                      </div>
                                                    </td>
                                                    <td className="text-center">
                                                      <div className="date_payoutbx">
                                                        <p>{i.payOutDate ? i.payOutDate : '-'}</p>
                                                      </div>
                                                    </td>
                                                    <td className="text-center">
                                                      <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className={`btn_icon ${i.payment_status === "Paid" ? "paid_btn" : i.payment_status === "Unpaid" ? "unpaid_btn" : ''}`}
                                                      >
                                                        <span className="icon_bx">
                                                          <Image
                                                            src={i.payment_status === "Paid" ? paidIcon : i.payment_status === "Unpaid" ? unPaidIcon : ''}
                                                            width={12}
                                                            height={12}
                                                            alt={i.payment_status === "Paid" ? "Paid Icon" : i.payment_status === "Unpaid" ? "Unpaid Icon" : ''}
                                                            className="me-1"
                                                          />
                                                        </span>
                                                        <span className="btn_tex">
                                                          {i.payment_status === "Paid" ? "Paid" : i.payment_status === "Unpaid" ? "Unpaid" : ''}
                                                        </span>
                                                      </Button>
                                                    </td>
                                                    <td className="text-center">
                                                      <div className="lumeSumTd d-flex align-items-center justify-content-center">
                                                        {/* <span className='text'>{100}</span> */}
                                                        <span className="icon">
                                                          <Image
                                                            src={
                                                              i.payment_status ==
                                                                "Unpaid"
                                                                ? UncheckIcon
                                                                : CheckIcon
                                                            }
                                                            alt="Paid Lump-Sum Icons"
                                                          />
                                                        </span>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                )) : <tr>
                                                <td
                                                  colSpan={5}
                                                  className="text-center"
                                                >
                                                  <span className="no_data_tex">
                                                    No data found!
                                                  </span>
                                                </td>
                                              </tr>}
                                          </tbody>
                                        </Table>
                                      </div>
                                    </div>
                                    {committee.members -
                                      (activeMemberUsers.length +
                                        pendingMemberUsers.length) <=
                                      0 ? null : (
                                      <p className="join_now_tx pt-2">
                                        There are{" "}
                                        {committee.members -
                                          (activeMemberUsers.length +
                                            pendingMemberUsers.length)}{" "}
                                        {committee.members -
                                          (activeMemberUsers.length +
                                            pendingMemberUsers.length) ===
                                          1
                                          ? "user"
                                          : "users"}{" "}
                                        left to join
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          ) : (
                            <ImageLoader />
                          )}
                        </div>
                      </div>
                    </div>
                    {/* inner table start */}
                    {Object.keys(committee).length ? <div className="manage_detail_wrapper">
                      <div className="divider_bx pt-10"></div>
                      <div className="mange_detail_two pt-20">
                        <div className="title_uper detail_notif_title d-flex flex-wrap align-items-center justify-content-between detail_list_notific pb-15">
                          <h3 className="fs-18 fw-500 secondary_color d-flex align-items-center">
                            <span className="log_icon">
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-history" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M12 8l0 4l2 2"></path>
                                <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"></path>
                              </svg>
                            </span>
                            Committee History Logs
                          </h3>
                          <div className="cstm_day_month boder_month max_w150">
                            <DatePickerStyles
                              dateFormat="MMM yyyy"
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                            />
                          </div>
                        </div>
                        {historyLogs.length ? <div className="history_log_bx user_scrolbx max_h340">
                          {historyLogs.map((item, index) => (
                            item.message ?
                              <div className="cstm_notif-detail" key={index}>
                                <div className="feedback_cardbx">
                                  <div className="feedback_cardinner">
                                    <div className="feedback_cardinner_bx d-flex flex-wrap align-items-center">
                                      <div className={`avtarbx ${item.type === 'payment' ? "Payment" : item.type === 'swap' ? "Swap" : item.type === 'swapAccept' ? "acceptSwap" : item.type === 'swapReject' ? "rejectSwap" : item.type === 'comInviteAccept' ? "invitation" : ''}`}>
                                        <span className="iconbx">
                                          <Image
                                            src={item.type === 'payment' ? Payment : item.type === 'swap' ? Swap : item.type === 'swapAccept' ? acceptSwap : item.type === 'swapReject' ? rejectSwap : item.type === 'comInviteAccept' ? invitation : ''}
                                            width={23}
                                            height={23}
                                            alt="history log"
                                          />
                                        </span>
                                      </div>
                                      <div className="feedback_cardbody">
                                        <h4>
                                          {item.message}
                                        </h4>
                                        <p>
                                          {(item?.timestamp &&
                                            moment(item.timestamp).format(
                                              "MMM DD, YYYY hh:mm a"
                                            )) ||
                                            ""}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              :
                              null
                          ))}
                          {
                            (moment(startDate).format("MMM YYYY") == moment(committee?.timestamp).format("MMM YYYY") || !startDate) && Object.keys(committee).length ?
                              <div className="cstm_notif-detail">
                                <div className="feedback_cardbx">
                                  <div className="feedback_cardinner">
                                    <div className="feedback_cardinner_bx d-flex flex-wrap align-items-center">
                                      <div className="avtarbx commitee_create">
                                        <span className="iconbx">
                                          <Image
                                            src={commitee_create}
                                            width={23}
                                            height={23}
                                            alt="history log"
                                          />
                                        </span>
                                      </div>
                                      <div className="feedback_cardbody">
                                        <h4>
                                          <b>{committee?.adminName}</b> creates a Committee titled <b>'{committee.title}'</b>.
                                        </h4>
                                        <p>{moment(committee?.timestamp).format("MMM DD, YYYY hh:mm a")}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              :
                              null
                          }
                        </div> : <div className="position-relative text-center px-2 py-1">{!loaderShow ? <span className='no_data_tex'>No Logs Found!</span> : <ImageLoader />}</div>}
                      </div>
                    </div> : null}
                    {/* inner table end */}
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
          {/* overlay box */}
          <div className="overlay_bg"></div>
          {/* overlay end */}
        </main>
      }
      <ActiveModal
        title='Do you want to Activate the committee?'
        show={activeModalShow}
        onHide={() => setActiveModalShow(false)}
        onActive={handleActivateCommittee}
      />
      <DeleteModal
        title='Do you want to deactivate the committee?'
        show={modalShow}
        onHide={() => setModalShow(false)}
        onDelete={handleDeleteDeactivate}
      />
      <RestartModal
        show={restartModalShow}
        id={id}
        committee={committee}
        firstPayoutDate={committee.firstPayOutDate}
        amount={committee.totalAmount}
        onHide={() => setRestartModalShow(false)}
      />
    </>
  );
};

export default ViewDetail;
