"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../../../style/dashboard.module.scss";
import Sidemenu from "../../../component/sidemenu/page";
import Headerbar from "../../../component/headerbar/page";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import UplaodIconbx from "public/images/camera_white.svg";
import ProfileIcon from "public/images/profile_pic.png";
import { getCookie, setCookie } from "cookies-next";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
// import { getStorage, ref, uploadBytes ,getDownloadURL} from "firebase/storage";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";

const ProfileEdit = () => {
  const adminUid = getCookie("AdminUid");
  const [sideShow, setSideShow] = useState(false);
  const [loaderShow, setLoaderShow] = useState(false);
  const [adminDetails, setAdminDetails] = useState();

  const router = useRouter();

  const [file, setFile] = useState();
  const [url, setUrl] = useState("");
  const [imageData, setImageData] = useState();

  const getAdminDetails = async () => {
    try {
      // setLoaderShow(true);
      const db = getFirestore();
      const adminRef = doc(db, "Users", adminUid);
      const adminSnap = await getDoc(adminRef);
      setAdminDetails({
        image: adminSnap.data().image,
        name: adminSnap.data().name,
        email: adminSnap.data().email,
        phone: adminSnap.data().phone,
        language: adminSnap.data().language,
        c_code: adminSnap.data().c_code,
      });
      // setLoaderShow(false);
    } catch (error) {
      return error;
    }
  };

  const updateAdminInfo = (event) => {
    try {
      const { name, value } = event.target;
      setAdminDetails({ ...adminDetails, [name]: value });
    } catch (error) {
      return error;
    }
  };

  const handleUpdateAdminClick = async (e) => {
    const storage = getStorage();
    const path = `/images/${imageData?.name}`;
    const storageRef = ref(storage, path);
    const metadata = {
      contentType: "image/jpeg",
    };
    const uploadTask = uploadBytesResumable(storageRef, imageData, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL);
          const db = getFirestore();
          const docRef = doc(db, "Users", adminUid);
          const data = {
            ...adminDetails,
            image: imageData ? downloadURL : adminDetails.image,
          };
          updateDoc(docRef, data)
            .then(() => {
              setCookie("AdminImage", data.image);
              router.push("/dashboard/profile");
            })
            .catch((error) => {
              return error;
            });
        });
      }
    );
  };

  const handleUploadChange = (e) => {
    if (e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
      setImageData(e.target.files[0]);
    }
  };

  useEffect(() => {
    getAdminDetails();
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
                    </div>
                    <div className="addd_form view_profile_edit ">
                      <div className="sm_form_box">
                        <Form className="cstm_formbx form_md">
                          <Form.Group className="form_cstm mb-3 cstm_upload_img">
                            <div className="profile_image">
                              <Image
                                src={
                                  file
                                    ? file
                                    : adminDetails?.image
                                    ? adminDetails.image
                                    : ProfileIcon
                                }
                                width={120}
                                height={120}
                                alt="profile_pic"
                                className="profile_pic_box"
                              />
                              <Form.Label
                                htmlFor="formFile"
                                className="upload_pic_file"
                              >
                                <span className="upload_btn_icon">
                                  <Image
                                    src={UplaodIconbx}
                                    width={15}
                                    height={15}
                                    alt="upload-icon"
                                    className="upload_pic_box"
                                  />
                                </span>
                              </Form.Label>
                              <Form.Control
                                type="file"
                                id="formFile"
                                name="image"
                                onChange={handleUploadChange}
                              />
                            </div>
                          </Form.Group>
                          <Form.Group className="form_cstm mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Name"
                              name="name"
                              value={adminDetails?.name}
                              onChange={updateAdminInfo}
                            />
                          </Form.Group>
                          <Form.Group className="form_cstm mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="demo@email.com"
                              name="email"
                              value={adminDetails?.email}
                              onChange={updateAdminInfo}
                              disabled
                            />
                          </Form.Group>
                          <Form.Group className="form_cstm mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="123-456-7890"
                              name="phone"
                              value={adminDetails?.phone}
                              onChange={updateAdminInfo}
                            />
                          </Form.Group>
                          {/* <Form.Group className="form_cstm mb-3">
                            <Form.Label>Language</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="language"
                              name="language"
                              value={adminDetails?.language}
                              disabled
                            />
                          </Form.Group> */}
                          <div className="pt-30">
                            <Row className="gutter_sml">
                              <Col>
                                <Button
                                  variant="primary"
                                  size="md"
                                  className="w-100"
                                  onClick={handleUpdateAdminClick}
                                >
                                  Update
                                </Button>
                              </Col>
                              <Col>
                                <Button
                                  variant="secondary"
                                  size="md"
                                  className="w-100"
                                  onClick={() =>
                                    router.push("/dashboard/profile")
                                  }
                                >
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
        <div className="overlay_bg"></div>
        {/* overlay end */}
      </main>
    </>
  );
};

export default ProfileEdit;
