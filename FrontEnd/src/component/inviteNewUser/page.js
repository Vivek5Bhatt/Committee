"use client";
import Image from "next/image";
import Button from "react-bootstrap/Button";
import paidIcon from "public/images/tick_white.svg";
import pendingIcon from "public/images/user_timer.svg";
import unpaidIcon from "public/images/clock_white.svg";
import { useState } from 'react';
import DeleteModal from '../Modal/DeleteModel/page';
import avtar1 from 'public/images/avtar1.svg';

const InviteNewUser = ({
  imagebxright,
  title,
  imagebx,
  handleRemoveMember,
  payment_status,
  pay_Out_Date,
  uid,
  deletePopupShow,
  setDeltePopupShow,
  invite_status,
  paid_lump_sum,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [name, setName] = useState("");
  const [uID, setUId] = useState("");

  const handleClick = (title, uid) => {
    if (deletePopupShow) {
      setDeltePopupShow(false);
    }
    handleRemoveMember(title, uid);
  };

  const deletModelShow = async (title, uid) => {
    setModalShow(true);
    setName(title);
    setUId(uid);
  };

  const handleDeleteMember = () => {
    handleRemoveMember(name, uID);
    setModalShow(false);
  };

  return (
    <>
      <div className="add_membercard_bx">
        <div className="notification_cardbx d-flex align-items-center flex-wrap">
          <div className='notification_profile'>
            <div className='notification_avtar'>
              <Image
                src={imagebx ? imagebx : avtar1}
                width={40}
                height={40}
                alt='Avtar 1'
              />
            </div>
          </div>
          <div className="notification_contentbx text-truncate">
            <h4 className="text-truncate">{title}</h4>
          </div>
          {pay_Out_Date ? (
            <div className="date_payoutbx">
              <p>{pay_Out_Date}</p>
            </div>
          ) : null}
          <div className="right_closebx">
            <Button
              variant="link"
              size="sm"
              className="btnclose_round closebtn-icon"
              onClick={
                deletePopupShow
                  ? () => deletModelShow(title, uid)
                  : () => handleClick(title, uid)
              }
            >
              <Image src={imagebxright} width={16} height={16} alt="close" />
            </Button>
            {payment_status ? (
              <Button
                variant="primary"
                size="sm"
                className={` btn_icon  ${payment_status == "Unpaid" && invite_status === "Accept"
                  ? "unpaid_btn"
                  : payment_status == "Paid" && invite_status === "Accept"
                    ? "paid_btn"
                    : "pending_btn"
                  }`}
              >
                <span className="icon_bx">
                  <Image
                    src={
                      payment_status == "Unpaid" && invite_status === "Accept"
                        ? unpaidIcon
                        : payment_status == "Paid" && invite_status === "Accept"
                          ? paidIcon
                          : pendingIcon
                    }
                    width={12}
                    height={12}
                    alt="paid_icon"
                    className="me-1"
                  />
                </span>
                <span className="btn_tex">
                  {invite_status === "Accept" ? payment_status : invite_status}
                </span>
              </Button>
            ) : null}
          </div>
          <div className="lump_sumbx">{paid_lump_sum}</div>
        </div>
      </div>
      <DeleteModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onDelete={handleDeleteMember}
      />
    </>
  );
}

export default InviteNewUser;
