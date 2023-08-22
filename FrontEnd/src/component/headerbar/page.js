"use client";
import Image from "next/image";
import styles from "../../style/sidemenu.module.scss";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import avtaricon from "public/images/avtar.svg";
// import avtar1 from 'public/images/avtar1.svg';
// import avtar2 from 'public/images/avtar2.svg';
// import avtar3 from 'public/images/avtar3.svg';
// import avtar4 from 'public/images/avtar4.svg';
// import Searchicon from "public/images/search_icon.svg";
// import Notifactionicon from 'public/images/notifaction_dark.svg';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';
// import Form from "react-bootstrap/Form";
// import NotificationComponent from '../notificationcomponent/page';
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthUserContext";
import { getCookie } from "cookies-next";

const Headerbar = ({ title, searchText }) => {
  const ProfileImage = getCookie("AdminImage")
  const { loading, authUser } = useAuth();
  const router = useRouter();

  const handleLogOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        router.push("/");
      })
      .catch((e) => {
        return e;
      });
  };

  const handleProfile = () => {
    router.push("/dashboard/profile");
  }

  return (
    <div className={`${styles.headerbar} main_headerbx`}>
      <Navbar className="cstm_header light_headerbx">
        <div className="titlebar fw-500 fs-28 secondary_color">{title}</div>
        {/* <Form className="d-flex m-auto search_bartop">
          <div className='searchbar_main'>
            <Form.Control
              type="text"
              placeholder="Search..."
              className="cstm-searchbar"
              aria-label="Search"
            />
            <span className='search_icon'>
              <Image src={Searchicon} alt='search_icon' width={18} />
            </span>
          </div>
        </Form> */}
        <Nav
          className="align-items-center header_manubar ms-auto"
          style={{ maxHeight: "100px" }}
          navbarScroll
        >
          {/* <Dropdown className='cstm_dropdown drop_lang'>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              ENG
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
          {/* <Dropdown className='cstm_dropdown drop_notifaction'>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              <div className='notific-bar'>
                <Image
                  src={Notifactionicon}
                  alt="notifation"
                  width={18}
                />
                <span className='notifaction_dot'></span>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <div className='notific_dropbx'>
                <h4 className='drop_notific_title'>Notifications</h4>
                <div className='notific_tabs'>
                  <Tabs
                    defaultActiveKey="outstanding_payment"
                    id="fill-tab-example"
                    className="cstm_tabs"
                    fill
                  >
                    <Tab eventKey="outstanding_payment" title="Outstanding Payment">
                      <div className='tabs_notif_list'>
                        <NotificationComponent
                          imagebx={avtar1}
                          title="Lorem Ipsum dummy text"
                          subtitle="Lorem Ipsum is simply dummy..."
                          time="02:30pm"
                        />
                        <NotificationComponent
                          imagebx={avtar2}
                          title="Lorem Ipsum dummy text"
                          subtitle="Lorem Ipsum is simply dummy..."
                          time="03:45pm"
                        />
                        <NotificationComponent
                          imagebx={avtar3}
                          title="Lorem Ipsum dummy text"
                          subtitle="Lorem Ipsum is simply dummy..."
                          time="Yesterday"
                        />
                        <NotificationComponent
                          imagebx={avtar4}
                          title="Lorem Ipsum dummy text"
                          subtitle="Lorem Ipsum is simply dummy..."
                          time="2days ago"
                        />
                      </div>
                    </Tab>
                    <Tab eventKey="new_messages" title="New messages">
                      <div className='tabs_notif_list'>
                        <NotificationComponent
                          imagebx={avtar3}
                          title="Lorem Ipsum dummy text"
                          subtitle="Lorem Ipsum is simply dummy..."
                          time="Yesterday"
                        />
                        <NotificationComponent
                          imagebx={avtar4}
                          title="Lorem Ipsum dummy text"
                          subtitle="Lorem Ipsum is simply dummy..."
                          time="2days ago"
                        />
                        <NotificationComponent
                          imagebx={avtar1}
                          title="Lorem Ipsum dummy text"
                          subtitle="Lorem Ipsum is simply dummy..."
                          time="02:30pm"
                        />
                        <NotificationComponent
                          imagebx={avtar2}
                          title="Lorem Ipsum dummy text"
                          subtitle="Lorem Ipsum is simply dummy..."
                          time="03:45pm"
                        />
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </Dropdown.Menu>
          </Dropdown> */}
          <Dropdown className="cstm_dropdown drop_profilr">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              <Image src={ProfileImage ? ProfileImage : avtaricon} alt="avtar" width={35} height={35} />
              {/* <Image src={avtaricon} alt="avtar" width={35} height={35} /> */}

            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Button variant="link" onClick={handleProfile}>
                Profile
              </Button>
              <Button variant="link" onClick={handleLogOut}>
                Logout
              </Button>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>
    </div>
  );
}

export default Headerbar;
