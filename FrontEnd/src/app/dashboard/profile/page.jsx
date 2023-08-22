"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../../../style/dashboard.module.scss";
import Sidemenu from "../../../component/sidemenu/page";
import Headerbar from "../../../component/headerbar/page";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Editicon from "public/images/edit_white.svg";
import ProfileIcon from "public/images/profile_pic.png";
import bgprofile from "public/images/bg_profie.svg";
import { getCookie } from "cookies-next";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import avtaricon from "public/images/profile_pic.png";

const Profile = () => {
  const adminUid = getCookie("AdminUid");
  const [sideShow, setSideShow] = useState(false);
  const [adminData, setAdminData] = useState();
  const router = useRouter();

  const getAdminData = async () => {
    try {
      const db = getFirestore();
      const adminRef = doc(db, "Users", adminUid);
      const adminSnap = await getDoc(adminRef);
      setAdminData({
        image: adminSnap.data().image,
        name: adminSnap.data().name,
        email: adminSnap.data().email,
        phoneNo: adminSnap.data().phone,
        language: adminSnap.data().language,
        c_code: adminSnap.data().c_code,
      });
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getAdminData();
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
            <Headerbar title="Edit Profile" />
          </div>
          <div className={`${styles.page_inner} dashbaord_inner_pagebx`}>
            <div className="managecom_list pt-10">
              <Card className="cstmcard create_commit_bx min_h70">
                <Card.Body>
                  <div className="card_subtitle">
                    <div className="carddetail_head divider_bx pb-20 d-flex align-items-center justify-content-between flex-wrap">
                      <div className="cardbox1">
                        <h3 className="fs-18 fw-500 secondary_color ">
                          Profile Details
                        </h3>
                      </div>
                      <div className="cardbox2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="btn_icon"
                          onClick={() => router.push("/dashboard/profileedit")}
                        >
                          <span className="icon_bx">
                            <Image
                              src={Editicon}
                              width={13}
                              height={13}
                              alt="addicon"
                              className="me-1"
                            />
                          </span>
                          <span className="btn_tex"> Edit</span>
                        </Button>
                      </div>
                    </div>
                    <div className="addd_form view_profile pt-30 pb-20">
                      <div className="sm_profile_cardbox ">
                        <div className="cstm_profile_iner">
                          <div className="bg_imgbx">
                            <Image
                              src={bgprofile}
                              width={350}
                              height={110}
                              alt="profile_bg"
                              className="profile_pic_pattern"
                            />
                          </div>
                          <div className="cstm_formbx form_md">
                            <div className="cstm_formbx form_md">
                              <div className="profile_image text-center pb-30">
                                <Image
                                  src={
                                    adminData?.image
                                      ? adminData.image
                                      : ProfileIcon
                                  }
                                  width={120}
                                  height={120}
                                  alt="profile_pic"
                                  className="profile_pic_box"
                                />
                              </div>
                              <div className="form_cstm d-flex align-items-center">
                                <div className="profile_label max-w120">
                                  Name:
                                </div>
                                <p className="profile_detail_list">
                                  {adminData?.name ? adminData.name : ""}{" "}
                                </p>
                              </div>
                              <div className="form_cstm d-flex align-items-center">
                                <div className="profile_label max-w120">
                                  Email:
                                </div>
                                <p className="profile_detail_list word-break-all">
                                  {adminData?.email ? adminData.email : ""}
                                </p>
                              </div>
                              <div className="form_cstm d-flex align-items-center">
                                <div className="profile_label max-w120">
                                  Phone Number:
                                </div>
                                <p className="profile_detail_list">
                                  {adminData?.phoneNo}
                                </p>
                              </div>
                              {/* <div className="form_cstm d-flex align-items-center">
                                <div className="profile_label max-w120">
                                  Language:
                                </div>
                                <p className="profile_detail_list">
                                  {adminData?.language
                                    ? adminData.language
                                    : ""}
                                </p>
                              </div> */}
                            </div>
                          </div>
                        </div>
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

export default Profile;
