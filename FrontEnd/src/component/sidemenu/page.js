"use client";
import Stack from "react-bootstrap/Stack";
import Image from "next/image";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import styles from "../../style/sidemenu.module.scss";
import Logowhite from "public/images/logo-white.svg";
import Logowhitesmall from "public/images/logo-white-small.svg";
import Dashboardicon from "public/images/dashoard-icon.svg";
import Manageicon from "public/images/manage_icon.svg";
import ManageUsericon from "public/images/manage-user.svg";
import Notificationicon from "public/images/manage_notification-icon.svg";
import Paymenticon from "public/images/manage_payment-icon.svg";
import feedbackicon from "public/images/feedback-icon.svg";
import Logouticon from "public/images/logout-icon.svg";
import arrowRight from "public/images/chevron_blue.svg";
import ActiveLog from "public/images/active_log_white.svg";

import Nav from "react-bootstrap/Nav";
import { getAuth, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../../context/AuthUserContext";
import { useEffect } from "react";

const Sidemenu = ({ sideShow, setSideShow }) => {
  const { loading, authUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        return error;
      });
  };

  // body class overflow
  useEffect(() => {
    if (sideShow) {
      document.querySelector("body").classList.add("overflow_hiddenbx");
    } else {
      document.querySelector("body").classList.remove("overflow_hiddenbx");
    }
  }, [sideShow]);
  // body class overflow end

  return (
    <>
      <Stack gap={1} className={`${styles.sidemanu_box} sidebar_box`}>
        {/* button toggle */}
        <button
          className={`btn_collapse_sidebar ${sideShow ? "btn_left_toggle" : "btn_right_toggle"
            }`}
          onClick={() => setSideShow(!sideShow)}
        >
          <Image src={arrowRight} width={18} height={18} alt="arrow_right" />
        </button>
        <div className={`${styles.logobar} side_logobar`}>
          <Link href="#">
            <Image
              className="logo1"
              src={Logowhitesmall}
              width={30}
              alt="logo"
            />
            <Image className="logo2" src={Logowhite} width={180} alt="logo" />
            {/* {sideShow ? (
              <Image src={Logowhitesmall} width={30} alt="logo" />
            ) : (
              <Image src={Logowhite} width={180} alt="logo" />
            )} */}
          </Link>
        </div>
        <div className={`${styles.sidenavlink} side_menu`}>
          <Nav className="flex-column">
            {/* <Nav.Item>
              <Nav.Link eventKey="disabled" disabled className='menu_title'>Main Menu</Nav.Link>
            </Nav.Item> */}
            <Nav.Item>
              <Link
                href="/dashboard"
                className={`nav-link ${pathname == "/dashboard/" ? "active" : ""
                  }`}
              >
                <span className="icon_bx">
                  <Image src={Dashboardicon} width={16} alt="dashboard_icon" />
                </span>
                <span className="text_menu">Dashboard</span>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                href="/dashboard/manageuser"
                className={`nav-link ${pathname.includes("/dashboard/manageuser/") ? "active" : ""
                  }`}
              >
                <span className="icon_bx">
                  <Image
                    src={ManageUsericon}
                    width={16}
                    alt="manage_user_icon"
                  />
                </span>
                <span className="text_menu">Manage Users</span>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                href="/dashboard/managecommittee"
                className={`nav-link ${pathname.includes("/dashboard/managecommittee/") ? "active" : ""
                  }`}
              >
                <span className="icon_bx">
                  <Image src={Manageicon} width={16} alt="manage_icon" />
                </span>
                <span className="text_menu">Manage Committees</span>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                href="/dashboard/managepayment"
                className={`nav-link ${pathname.includes("/dashboard/managepayment/") ? "active" : ""
                  }`}
              >
                <span className="icon_bx">
                  <Image src={Paymenticon} width={16} alt="payment_icon" />
                </span>
                <span className="text_menu">Manage Payments</span>
              </Link>
            </Nav.Item>
            {/* <Nav.Item>
            <Link href="/dashboard/managenotifications" className={`nav-link ${pathname.includes("/dashboard/managenotifications/") ? "active" : ""}`}>
              <span className='icon_bx'>
                <Image
                  src={Notificationicon}
                  width={16}
                  alt="notification_icon"
                />
              </span>
              <span className='text_menu'>Manage Notifications</span>
            </Link>
          </Nav.Item> */}

            <Nav.Item>
              <Link
                href="/dashboard/feedbacks"
                className={`nav-link ${pathname.includes("/dashboard/feedbacks/") ? "active" : ""
                  }`}
              >
                <span className="icon_bx">
                  <Image src={feedbackicon} width={16} alt="feedback_icon" />
                </span>
                <span className="text_menu">Feedbacks</span>
              </Link>
            </Nav.Item>

            {/* Committees Activity logs------------->>>>>>> */}
            <Nav.Item>
              <Link
                href="/dashboard/committeelogs"
                className={`nav-link ${pathname.includes("/dashboard/committeelogs/") ? "active" : ""
                  }`}
              >
                <span className="icon_bx">
                  <Image src={ActiveLog} width={16} alt="committeLogs_icon" />
                </span>
                <span className="text_menu">Committee Activity Logs</span>
              </Link>
            </Nav.Item>

            <div className="sidemenu_footer mt-auto">
              <Nav.Item>
                <Button
                  variant="link"
                  className="cstm_btn_link nav-link"
                  onClick={handleLogOut}
                >
                  <span className="icon_bx">
                    <Image src={Logouticon} width={16} alt="logout_icon" />
                  </span>
                  <span className="text_menu">Logout</span>
                </Button>
              </Nav.Item>
            </div>
          </Nav>
        </div>
      </Stack>
    </>
  );
};

export default Sidemenu;
