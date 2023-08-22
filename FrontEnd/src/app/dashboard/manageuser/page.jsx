"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../../../style/dashboard.module.scss";
import Sidemenu from "../../../component/sidemenu/page";
import Headerbar from "../../../component/headerbar/page";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import doticon from "public/images/action_dot.svg";
import Searchicon from "public/images/search_icon.svg";
import Dropdown from "react-bootstrap/Dropdown";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Pagination from "../../../component/pagination/page";
import Badge from "react-bootstrap/Badge";
import ImageLoader from "../../../component/ImageLoader/page";
import { useMemo } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import useSortableData from "../../../../utils/tableSort/page";
import SwapGroupGrey from "public/images/swap_group_grey.svg";
import sort_up from "public/images/sort_up.svg";
import sort_down from "public/images/sort_down.svg";
// import SendSmsModal from "../../../component/Modal/SendSmsModal/page";

const User = () => {
  const [sideShow, setSideShow] = useState(false);
  const [loaderShow, setLoaderShow] = useState(false);
  const [users, setUsers] = useState([]);
  // const [modalShow, setModalShow] = useState(false);
  // const [sendSmsUser, setSendSmsUser] = useState({});
  const [serachUser, setSerachUser] = useState("");
  const [userOptn, setUserOptn] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(7);

  const router = useRouter();
  const userActive = getCookie("user-active");

  const getUserData = async () => {
    setLoaderShow(true);
    const db = getFirestore();
    const userRef = collection(db, "Users");
    const committeeMemberRef = collection(db, "Committee_Members");
    const committeeRef = collection(db, "Committee");
    const userDocSnap = await getDocs(
      query(userRef, where("role", "!=", "Admin"))
    );
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
            return item.committee && item;
          }
        }),
      });
    });
    setUsers(userData);
    setLoaderShow(false);
  };

  const handleSearchUser = (event) => {
    setSerachUser(event.target.value);
    setCurrentPage(1);
  };

  const userData = useMemo(() => {
    if (serachUser) {
      return users.filter(
        (item) =>
          (item.name.toLowerCase().includes(serachUser.toLowerCase().trim()) ||
            item.phone
              .toLowerCase()
              .includes(serachUser.toLowerCase().trim()) ||
            item.email
              .toLowerCase()
              .includes(serachUser.toLowerCase().trim())) &&
          (item.status == userOptn || userOptn === "All")
      );
    } else if (userOptn === "All") {
      return users;
    } else {
      return users.filter((item) => item.status == userOptn);
    }
  }, [users, serachUser, userOptn]);

  // sorting table with name start ------------------>>>
  const { items, requestSort, sortConfig } = useSortableData(userData);

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
  const currentRecords = items?.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(items.length / recordsPerPage);
  //  Pagination End ----------------------->>>>>>>>>>>>

  useEffect(() => {
    getUserData();
    if (userActive) {
      setUserOptn(userActive);
      deleteCookie("user-active");
    }
  }, []);

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
            <Headerbar title="Manage Users" searchText={handleSearchUser} />
          </div>
          <div className={`${styles.page_inner} dashbaord_inner_pagebx`}>
            <div className="managecom_list pt-10 manageuser_main_box">
              <div className="list_title d-flex align-items-center justify-content-between pt-15 flex-wrap">
                <div className="right_sort topbar-selectbx cstm_rightbox_topbar">
                  {/* <label className="label_filterbx">Filter By Status</label> */}
                  <Form.Group className="form_cstm">
                    {/* <Form.Label>Status</Form.Label> */}
                    <Form.Select
                      aria-label="Default select example"
                      className="form-control cursor-pointer"
                      onChange={(e) => {
                        setUserOptn(e.target.value);
                        setCurrentPage(1);
                      }}
                      value={userOptn}
                    >
                      <option>All</option>
                      <option>Active</option>
                      <option>Deactive</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="totalUsers">
                  Total number of users: {users.length}
                </div>
                <div className="d-flex m-auto search_bartop">
                  <div className="search_outer">
                    <div className="searchbar_main">
                      <Form.Control
                        type="text"
                        placeholder="Search..."
                        className="cstm-searchbar"
                        aria-label="Search"
                        onChange={handleSearchUser}
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
              </div>
              <div className="table_box">
                <div className="cstm_table manage_user_tablebx">
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>
                          <div
                            className={`d-inline-flex sort_box sorting_data`}
                            type="button"
                            onClick={() => requestSort("name")}
                          >
                            <span className="sort_texname">Name</span>
                            <button className="sort_btn">
                              {getClassNamesFor("name") == "ascending" ? (
                                <Image
                                  src={sort_up}
                                  alt="sorting_up"
                                  height={10}
                                  width={10}
                                />
                              ) : getClassNamesFor("name") == "descending" ? (
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
                        <th className="text-center">Phone Number</th>
                        <th className="text-center">Email</th>
                        <th className="text-center">No. Of Committees</th>
                        <th className="text-center">Status</th>
                        {/* <th className="text-center">Action</th> */}
                      </tr>
                    </thead>
                    <tbody className="position-relative">
                      {currentRecords.length ? (
                        currentRecords.map((item, index) => (
                          <tr
                            key={index}
                            onClick={() =>
                              router.push(`/dashboard/manageuser/${item.uid}`)
                            }
                          >
                            <td>{item.name}</td>
                            <td className="text-center">
                              {`${item.c_code} ${item.phone.split(" ")[1]}`}
                            </td>
                            <td className="text-center">{item.email}</td>
                            <td className="text-center">
                              {item.committee_member.length}
                            </td>
                            <td className="text-center">
                              <Badge
                                className="cstm_badge round_badge"
                                bg={
                                  item.status === "Active"
                                    ? "green"
                                    : "red-light"
                                }
                              >
                                {item.status}
                              </Badge>
                            </td>
                            {/* <td>
                              <div className="drop_table_btn">
                                <Dropdown className="cstm_dropdown">
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                    className="action_btn_sml"
                                  >
                                    <Image
                                      src={doticon}
                                      alt="doticon"
                                      width={4}
                                    />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item
                                      onClick={() =>
                                        router.push(
                                          `/dashboard/manageuser/${item.uid}`
                                        )
                                      }
                                    >
                                      View Details
                                    </Dropdown.Item>
                                    {/* <Dropdown.Item
                                      onClick={() => {
                                        setModalShow(true);
                                        setSendSmsUser(item);
                                      }}
                                    >
                                      Send SMS
                                    </Dropdown.Item> 
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="td_spinner text-center">
                            {!loaderShow ? (
                              <span className="no_data_tex">
                                No data found!
                              </span>
                            ) : (
                              <ImageLoader />
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  {/* *************************************** */}
                  {currentRecords.length ? (
                    <Pagination
                      nPages={nPages}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* overlay box */}
        <div className="overlay_bg"></div>
        {/* overlay end */}
        {/* <SendSmsModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          userData={sendSmsUser}
        /> */}
      </main>
    </>
  );
};

export default User;
