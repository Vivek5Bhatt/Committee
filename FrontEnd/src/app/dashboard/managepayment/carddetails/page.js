"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../../../../style/dashboard.module.scss";
import Sidemenu from "../../../../component/sidemenu/page";
import Headerbar from "../../../../component/headerbar/page";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import addicon from "public/images/add-white.svg";
import Editicon from "public/images/edit_icon-white.svg";
import { collection, deleteDoc, doc, getDocs, getFirestore } from "firebase/firestore";
import ImageLoader from "../../../../component/ImageLoader/page";
import closeIcon from 'public/images/close-red.svg';
import backIcon from 'public/images/backArrow.svg';
import roundPlusIcon from 'public/images/roundadd.svg';
import DeleteIcon from 'public/images/delete.svg';
import DeleteModal from "../../../../component/Modal/DeleteModel/page";

const CardDetails = () => {
  const [sideShow, setSideShow] = useState(false);
  const router = useRouter();
  const [cardDetails, setCardDetails] = useState({});
  const [loaderShow, setLoaderShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [documentId, setDocumnetId] = useState()

  const getCardDetails = async () => {
    try {
      setLoaderShow(true);
      const db = getFirestore();
      const colRef = collection(db, "Add_Card");
      const docsSnap = await getDocs(colRef);
      docsSnap.forEach((doc) => {
        setCardDetails({
          name: doc.data().name,
          bank_name: doc.data().bank_name,
          account_Number: doc.data().account_Number,
          ifsc_code: doc.data().ifsc_code,
          docId: doc.id
        });
      });
      setLoaderShow(false);
    } catch (error) {
      return error
    }
  };

  const deletModelShow = (id) => {
    setModalShow(true)
    setDocumnetId(id)
  }

  const handleDeleteMember = async () => {
    const db = getFirestore();
    deleteDoc(doc(db, "Add_Card", documentId)).then(() => {
      setCardDetails({})
    })
    setModalShow(false)
  }

  useEffect(() => {
    getCardDetails();
  }, []);

  return (
    <>
      <main
        className={`${styles.main} main_wraper ${sideShow ? "sidebar_small" : "sidebar_full"
          }`}
      >
        <div className={`${styles.sidebar} leftsidebar`}>
          <Sidemenu sideShow={sideShow} setSideShow={setSideShow} />
        </div>
        <div className={`${styles.centerwrapper} centerpage`}>
          <div className={`${styles.top_manubar} menubar_toppage sticky_top`}>
            <Headerbar title="Manage Payment" />
          </div>
          <div className={`${styles.page_inner} dashbaord_inner_pagebx`}>
            <div className="managecom_list pt-10">
              <Card className="cstmcard create_commit_bx min_h70">
                <Card.Body>
                  <div className="card_subtitle">
                    <div className="carddetail_head divider_bx pb-20 d-flex align-items-center justify-content-between flex-wrap">
                      <div className="cardbox1">
                        <h3 className="fs-18 fw-500 secondary_color d-flex">
                          <Button
                            onClick={() => router.push('/dashboard/managepayment')}
                            className="cstm_iconbtn_sm"
                            variant="link"
                          >
                            <Image
                              src={backIcon}
                              width={14}
                              height={14}
                              alt="backicon"
                            />
                          </Button>
                          Card Details
                        </h3>
                      </div>

                      {
                        !cardDetails.docId ? <div className="cardbox2">
                          <Button
                            variant="primary"
                            size="sm"
                            className="btn_icon"
                            onClick={() =>
                              router.push("/dashboard/managepayment/addnewcard")
                            }
                          >
                            <span className="icon_bx">
                              <Image
                                src={addicon}
                                width={13}
                                height={13}
                                alt="addicon"
                                className="me-1"
                              />
                            </span>
                            <span className="btn_tex"> Add New</span>
                          </Button>
                        </div>
                          :
                          null
                      }

                    </div>
                    {/* ********************* */}
                    {Object.keys(cardDetails).length ?
                      <div className="card_detailbxx">
                        <Row>
                          <Col md={6} lg={5}>
                            <div className="account_card account_card_bg ">
                              <button
                                className="edit_btn_round"
                                onClick={() =>
                                  router.push(
                                    "/dashboard/managepayment/editcarddetails"
                                  )
                                }
                              >
                                <Image
                                  src={Editicon}
                                  width={14}
                                  height={14}
                                  alt="editicon"
                                />
                              </button>
                              {
                                cardDetails.docId ? <button
                                  className="edit_btn_round delete_btn_card"
                                  onClick={() => deletModelShow(cardDetails.docId)}>
                                  <Image
                                    src={DeleteIcon}
                                    width={14}
                                    height={14}
                                    alt="delteicon"
                                  />
                                </button>
                                  :
                                  null
                              }
                              <div className="account_header">
                                <h4 className="bank_name">
                                  {cardDetails.bank_name}
                                </h4>
                              </div>
                              <div className="account_body">
                                <p className="card_num">
                                  {cardDetails.account_Number}
                                </p>
                              </div>
                              <div className="account_footer">
                                <Row>
                                  <Col xs={6} sm={6} md={8}>
                                    <div className="account_holder">
                                      <h5 className="account_name">
                                        Account Holder Name
                                      </h5>
                                      <h6 className="account-cstm">
                                        {cardDetails.name}
                                      </h6>
                                    </div>
                                  </Col>
                                  <Col xs={6} sm={6} md={4}>
                                    <div className="account_holder">
                                      <h5 className="account_name">
                                        IFSC Code
                                      </h5>
                                      <h6 className="account-ifsc">
                                        {cardDetails.ifsc_code}
                                      </h6>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div> :
                      <div className="td_spinner text-center">
                        {!loaderShow ? (
                          <div className="emplty_cardbx">
                            <div className="emplty_cardbx_inner">
                              <span className="iconbx">
                                <Image
                                  src={roundPlusIcon}
                                  width={70}
                                  height={70}
                                  alt="plusicon"
                                />
                              </span>
                              <p> No card found!</p>
                            </div>
                          </div>
                        ) : (
                          <ImageLoader />
                        )}
                      </div>
                    }
                    {/* ******************** */}
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
      <DeleteModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onDelete={handleDeleteMember}
        title={'Do you want to delete this card detail ?'}
      />
    </>
  );
}

export default CardDetails
