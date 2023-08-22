"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../../../../style/dashboard.module.scss";
import Sidemenu from "../../../../component/sidemenu/page";
import Headerbar from "../../../../component/headerbar/page";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { useParams } from "next/navigation";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Table from "react-bootstrap/Table";
import ImageLoader from "../../../../component/ImageLoader/page";
import paidIcon from "public/images/tick_white.svg";
import unPaidIcon from "public/images/uncheck.svg";
import pendingIcon from "public/images/user_timer.svg";
import backIcon from "public/images/backArrow.svg";
import moment from "moment";

const UserDetail = () => {
  const [sideShow, setSideShow] = useState(false);
  const [user, setUser] = useState({});
  const [totalDeposit, setTotalDeposit] = useState(0);

  const router = useRouter();
  const params = useParams();
  const id = params.detail;

  const getUserData = async () => {
    const db = getFirestore();
    const userRef = collection(db, "Users");
    const committeeMemberRef = collection(db, "Committee_Members");
    const committeeRef = collection(db, "Committee");
    const userDocSnap = await getDocs(userRef);
    const committeeMemberDocSnap = await getDocs(committeeMemberRef);
    const committeeDocSnap = await getDocs(committeeRef);
    let userData = [];
    let commiteeMemberData = [];
    let commiteeData = [];
    committeeMemberDocSnap.forEach((doc) => {
      commiteeMemberData.push({ docId: doc.id, ...doc.data() });
    });
    committeeDocSnap.forEach((doc) => {
      commiteeData.push({ docId: doc.id, ...doc.data() });
    });
    userDocSnap.forEach((doc) => {
      userData.push({
        ...doc.data(),
        committee_member: commiteeMemberData.filter((item) => {
          if (item.uid === doc.id) {
            const committee = commiteeData.find(
              (data) => data.docId === item.committee_id
            );
            item.committee = committee;
            return item;
          }
        }),
      });
    });
    const data = userData.find((item) => item.uid === id);
    setUser(data);
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const deposit = user.committee_member?.reduce(
      (acc, val) =>
        acc +
        (val.committee?.totalDepositPayout
          ? Number(val?.committee?.totalDepositPayout)
          : 0),
      0
    );
    setTotalDeposit(deposit);
  }, user.committee_member?.committee);

  return (
    <>
      <main
        className={`${styles.main} main_wraper ${
          sideShow ? "sidebar_small" : "sidebar_full"
        }`}
      >
        <div className={`${styles.sidebar} leftsidebar`}>
          <Sidemenu sideShow={sideShow} setSideShow={setSideShow} />
        </div>
        <div className={`${styles.centerwrapper} centerpage`}>
          <div className={`${styles.top_manubar} menubar_toppage sticky_top`}>
            <Headerbar title="User Details" />
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
                            onClick={() => router.push("/dashboard/manageuser")}
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
                    </div>
                    <div className="addd_form position-relative min_h100">
                      <div className="viewbox_group">
                        {Object.keys(user).length ? (
                          <Row>
                            <Col md={5}>
                              <div className="md_form_box full_box-xxl">
                                <div className="view_detail_box">
                                  <div className="view_detail_outerbxx">
                                    <Row className="gutter_sml">
                                      <Col
                                        xs={4}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        className="box1"
                                      >
                                        <div className="user_label">Name :</div>
                                      </Col>
                                      <Col
                                        xs={8}
                                        sm={8}
                                        md={8}
                                        lg={8}
                                        className="box2"
                                      >
                                        <div className="user_detail_list">
                                          {user?.name}
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="view_detail_outerbxx">
                                    <Row className="gutter_sml">
                                      <Col
                                        xs={4}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        className="box1"
                                      >
                                        <div className="user_label">
                                          Phone :
                                        </div>
                                      </Col>
                                      <Col
                                        xs={8}
                                        sm={8}
                                        md={8}
                                        lg={8}
                                        className="box2"
                                      >
                                        <div className="user_detail_list">
                                          {`${user.c_code} ${
                                            user.phone.split(" ")[1]
                                          }`}
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="view_detail_outerbxx">
                                    <Row className="gutter_sml">
                                      <Col
                                        xs={4}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        className="box1"
                                      >
                                        <div className="user_label">
                                          Email :
                                        </div>
                                      </Col>
                                      <Col
                                        xs={8}
                                        sm={8}
                                        md={8}
                                        lg={8}
                                        className="box2"
                                      >
                                        <div className="user_detail_list">
                                          {user?.email}
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  {/* <div className="view_detail_outerbxx">
                                    <Row className="gutter_sml">
                                      <Col
                                        xs={4}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        className="box1"
                                      >
                                        <div className="user_label">
                                          Language :
                                        </div>
                                      </Col>
                                      <Col
                                        xs={8}
                                        sm={8}
                                        md={8}
                                        lg={8}
                                        className="box2"
                                      >
                                        <div className="user_detail_list">
                                          {user?.language}
                                        </div>
                                      </Col>
                                    </Row>
                                  </div> */}
                                  <div className="view_detail_outerbxx">
                                    <Row className="gutter_sml">
                                      <Col
                                        xs={4}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        className="box1"
                                      >
                                        <div className="user_label">
                                          Total Deposited :
                                        </div>
                                      </Col>
                                      <Col
                                        xs={8}
                                        sm={8}
                                        md={8}
                                        lg={8}
                                        className="box2"
                                      >
                                        <div className="user_detail_list">
                                          {totalDeposit}
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="view_detail_outerbxx">
                                    <Row className="gutter_sml">
                                      <Col
                                        xs={4}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        className="box1"
                                      >
                                        <div className="user_label">
                                          Status :
                                        </div>
                                      </Col>
                                      <Col
                                        xs={8}
                                        sm={8}
                                        md={8}
                                        lg={8}
                                        className="box2"
                                      >
                                        <div className="user_detail_list">
                                          <Badge
                                            className="cstm_badge round_badge"
                                            bg={
                                              user?.status === "Active"
                                                ? "green"
                                                : "grey"
                                            }
                                          >
                                            {user?.status}
                                          </Badge>
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
                                  Committees ({user?.committee_member?.length})
                                </h3>
                                <div className="right_card_greybx user_scrolbx max_h340">
                                  <div className="table_box">
                                    <div className="cstm_table">
                                      <Table responsive>
                                        <thead>
                                          <tr>
                                            <th>Name</th>
                                            <th className="text-center">
                                              Next Pay-Out Date
                                            </th>
                                            <th className="text-center">
                                              Total Deposit
                                            </th>
                                            <th className="text-center">
                                              Status
                                            </th>
                                            <th className="text-center">
                                              Committee Status
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {user?.committee_member?.length ? (
                                            user?.committee_member
                                              ?.sort(function (a, b) {
                                                const x = moment(
                                                  a?.committee?.nextPayoutDate,
                                                  "DD/MM/YYYY"
                                                )
                                                  .toDate()
                                                  .getTime();
                                                const y = moment(
                                                  b?.committee?.nextPayoutDate,
                                                  "DD/MM/YYYY"
                                                )
                                                  .toDate()
                                                  .getTime();
                                                return x - y;
                                              })
                                              .map((item, index) => {
                                                return (
                                                  <>
                                                    {item.committee ? (
                                                      <tr
                                                        key={index}
                                                        onClick={() =>
                                                          router.push(
                                                            `/dashboard/managecommittee/${item.committee_id}`
                                                          )
                                                        }
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
                                                      >
                                                        <td>
                                                          {
                                                            item?.committee
                                                              ?.title
                                                          }
                                                        </td>
                                                        <td className="text-center">
                                                          {
                                                            item?.committee
                                                              ?.nextPayoutDate
                                                          }
                                                        </td>
                                                        <td className="text-center">
                                                          {item?.committee
                                                            ?.totalDepositPayout
                                                            ? item?.committee
                                                                ?.totalDepositPayout
                                                            : 0}
                                                        </td>
                                                        <td className="text-center">
                                                          <Button
                                                            variant="primary"
                                                            size="sm"
                                                            className={`btn_icon ${
                                                              item.invite_status !==
                                                                "Pending" &&
                                                              item.payment_status ===
                                                                "Paid"
                                                                ? "paid_btn"
                                                                : item.invite_status !==
                                                                    "Pending" &&
                                                                  item.payment_status ===
                                                                    "Unpaid"
                                                                ? "unpaid_btn"
                                                                : "pending_btn"
                                                            }`}
                                                          >
                                                            <span className="icon_bx">
                                                              <Image
                                                                src={
                                                                  item.invite_status !==
                                                                    "Pending" &&
                                                                  item.payment_status ===
                                                                    "Paid"
                                                                    ? paidIcon
                                                                    : item.invite_status !==
                                                                        "Pending" &&
                                                                      item.payment_status ===
                                                                        "Unpaid"
                                                                    ? unPaidIcon
                                                                    : pendingIcon
                                                                }
                                                                width={12}
                                                                height={12}
                                                                alt={
                                                                  item.invite_status !==
                                                                    "Pending" &&
                                                                  item.payment_status ===
                                                                    "Paid"
                                                                    ? "Paid Icon"
                                                                    : item.invite_status !==
                                                                        "Pending" &&
                                                                      item.payment_status ===
                                                                        "Unpaid"
                                                                    ? "Unpaid Icon"
                                                                    : "Pending Icon"
                                                                }
                                                                className="me-1"
                                                              />
                                                            </span>
                                                            <span className="btn_tex">
                                                              {item.invite_status !==
                                                                "Pending" &&
                                                              item.payment_status ===
                                                                "Paid"
                                                                ? "Paid"
                                                                : item.invite_status !==
                                                                    "Pending" &&
                                                                  item.payment_status ===
                                                                    "Unpaid"
                                                                ? "Unpaid"
                                                                : "Pending"}
                                                            </span>
                                                          </Button>
                                                        </td>
                                                        <td className="text-center">
                                                          <Badge
                                                            className="cstm_badge"
                                                            pill
                                                            bg={
                                                              item?.committee
                                                                ?.status ===
                                                              "Active"
                                                                ? "green"
                                                                : "grey"
                                                            }
                                                          >
                                                            {
                                                              item?.committee
                                                                ?.status
                                                            }
                                                          </Badge>
                                                        </td>
                                                      </tr>
                                                    ) : null}
                                                  </>
                                                );
                                              })
                                          ) : (
                                            <tr>
                                              <td
                                                colSpan={5}
                                                className="text-center"
                                              >
                                                <span className="no_data_tex">
                                                  No data found!
                                                </span>
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </Table>
                                    </div>
                                  </div>
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
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
        {/* overlay box */}
        <div className="overlay_bg"></div>
        {/* overlay end */}
      </main>
    </>
  );
};

export default UserDetail;
