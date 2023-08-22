"use client"
import { useState, useEffect } from 'react';
import styles from '../../style/dashboard.module.scss';
import Sidemenu from '../../component/sidemenu/page';
import Headerbar from '../../component/headerbar/page';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Usercard from '../../component/card/usercard/page';
import Useractive from 'public/images/active_user.svg';
import UserInvite from 'public/images/user_invite.svg';
import Card from 'react-bootstrap/Card';
import StatisticsCard from '../../component/card/StatisticsCard/page';
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import moment from 'moment';
// import Globeblue from 'public/images/globe_blue.svg';

const Dashboard = () => {
  const [sideShow, setSideShow] = useState(false)
  const [users, setUsers] = useState([])
  const [committeeData, setCommitteeData] = useState([])
  const [committeeMember, setCommitteeMember] = useState([])
  const [loginHistory, setLoginHistory] = useState([])
  const [activeUser, setActiveUser] = useState([])
  const [activeCommittee, setActiveCommittee] = useState([])
  const [averageCommiteeMember, setAverageCommiteeMember] = useState([])
  const [averageCommitteeDeposit, setAverageCommitteeDeposit] = useState([])
  const [avgDailyLogin, setAvgDailyLogin] = useState(0)
  const [avgWeeklyLogin, setAvgWeeklyLogin] = useState(0)
  const [avgMonthlyLogin, setAvgMonthlyLogin] = useState(0)
  const [avgYearlyLogin, setAvgYearlyLogin] = useState(0)

  const db = getFirestore();

  const getUsersData = async () => {
    const userRef = collection(db, "Users");
    const userSnap = await getDocs(query(userRef, where('role', '!=', 'Admin')));
    let userData = []
    userSnap.forEach(doc => {
      userData.push({ docId: doc.id, ...doc.data() })
    })
    let activeUserData = userData.filter((item) => item.status === "Active")
    setUsers(userData)
    setActiveUser(activeUserData)
  }

  const getCommitteeData = async () => {
    const committeeRef = collection(db, "Committee");
    const committeeSnap = await getDocs(committeeRef);
    let committeeData = []
    committeeSnap.forEach(doc => {
      committeeData.push({ docId: doc.id, ...doc.data() })
    })
    let activeCommiteeData = committeeData.filter((item) => item.status === "Active")
    let averageCommiteeMember = committeeData.map((item) => item.members)
    let averageCommitteeDeposit = committeeData.map((item) => parseInt(item.deposit))
    setCommitteeData(committeeData)
    setActiveCommittee(activeCommiteeData)
    setAverageCommiteeMember(averageCommiteeMember)
    setAverageCommitteeDeposit(averageCommitteeDeposit)
  }

  const getCommitteeMemberData = async () => {
    const committeeMemberRef = collection(db, "Committee_Members")
    const committeeMemberSnap = await getDocs(query(committeeMemberRef, where('uid', '==', '')))
    let committeeMemberData = []
    committeeMemberSnap.forEach(doc => {
      committeeMemberData.push({ docId: doc.id, ...doc.data() })
    })
    setCommitteeMember(committeeMemberData)
  }

  const getLoginHistoryData = async () => {
    const loginHistoryRef = collection(db, "LoginHistory")
    const loginHistorySnap = await getDocs(query(loginHistoryRef, orderBy('timestamp', 'asc')))
    let loginHistoryData = []
    loginHistorySnap.forEach(doc => {
      loginHistoryData.push({ docId: doc.id, ...doc.data() })
    })
    setLoginHistory(loginHistoryData)
  }

  const calculateAverageGroupSize = (array) => {
    var total = 0;
    var count = 0;
    array.forEach(function (item) {
      total += item;
      count++;
    });
    return Math.round(total / count);
  }

  useEffect(() => {
    const firstTimestamp = loginHistory[0]?.timestamp
    const todayTimestamp = moment().toDate().getTime()
    if (firstTimestamp && todayTimestamp) {
      const startDate = moment(moment(firstTimestamp).format('YYYY-MM-DD'))
      const currentDate = moment(moment(todayTimestamp).format('YYYY-MM-DD'))
      const totalDays = currentDate.diff(startDate, 'days')
      const totalWeeks = currentDate.diff(startDate, 'weeks')
      const totalMonths = currentDate.diff(startDate, 'months')
      const totalYears = currentDate.diff(startDate, 'years')
      setAvgDailyLogin(totalDays !== 0 ? Math.round(loginHistory?.length / totalDays) : 0)
      setAvgWeeklyLogin(totalWeeks !== 0 ? Math.round(loginHistory?.length / totalWeeks) : 0)
      setAvgMonthlyLogin(totalMonths !== 0 ? Math.round(loginHistory?.length / totalMonths) : 0)
      setAvgYearlyLogin(totalYears !== 0 ? Math.round(loginHistory?.length / totalYears) : 0)
    }
  }, [loginHistory])

  useEffect(() => {
    getUsersData()
    getCommitteeData()
    getCommitteeMemberData()
    getLoginHistoryData()
  }, [])

  return (
    <>
      <main className={`${styles.main} main_wraper ${sideShow ? 'sidebar_small' : 'sidebar_full'}`}  >
        <div className={`${styles.sidebar} leftsidebar`}>
          <Sidemenu sideShow={sideShow} setSideShow={setSideShow} />
        </div>
        <div className={`${styles.centerwrapper} centerpage`}>
          <div className={`${styles.top_manubar} menubar_toppage sticky_top`}>
            <Headerbar title="Dashboard" />
          </div>
          <div className={`${styles.page_inner} dashbaord_inner_pagebx`}>
            <div className={`${styles.active_usercard} dashboard_maincontain_bx`}>
              <Row className='gap_20px cstm_rowbox'>
                <Col md={4}>
                  <Usercard
                    subtitle="Active Users"
                    number={activeUser ? activeUser.length : 0}
                    icon={Useractive}
                    bgbox="bgsky"
                    numcolor="texwhite"
                    onLink='/dashboard/manageuser'
                  />
                </Col>
                <Col md={4}>
                  <Usercard
                    subtitle="Active Committees"
                    number={activeCommittee ? activeCommittee.length : 0}
                    icon={UserInvite}
                    bgbox="bggrey"
                    numcolor="texwhite"
                    onLink='/dashboard/managecommittee'
                  />
                </Col>
                {/* <Col md={4}>
                  <Usercard
                    subtitle="Users Division by Country"
                    number="1.2K"
                    icon={Globeblue}
                    bgbox="bgwhite"
                    numcolor="texprimary"
                  />
                </Col> */}
              </Row>
            </div>
            <div className={`${styles.statistic_user} pt-30`}>
              <Card className='cstmcard'>
                <Card.Body>
                  <div className='title_sml'>
                    <h3>User Statistics</h3>
                  </div>
                  <div className={styles.grid_main}>
                    <div className={styles.grid_item}>
                      <StatisticsCard
                        bgcolor="bgpink"
                        title="Registered Users"
                        price={users ? users.length : 0}
                      />
                    </div>
                    <div className={styles.grid_item}>
                      <StatisticsCard
                        bgcolor="bgsky_light"
                        title="Invited Users"
                        price={committeeMember ? committeeMember.length : 0}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className={`${styles.statistic_user} pt-30`}>
              <Card className='cstmcard'>
                <Card.Body>
                  <div className='title_sml'>
                    <h3>Committee Statistics</h3>
                  </div>
                  <div className={styles.grid_main}>
                    <div className={styles.grid_item}>
                      <StatisticsCard
                        bgcolor="bgsky_light"
                        title="Avg. Group Member Size"
                        price={averageCommiteeMember.length ? calculateAverageGroupSize(averageCommiteeMember) : 0}
                      />
                    </div>
                    <div className={styles.grid_item}>
                      <StatisticsCard
                        bgcolor="bgpurple"
                        title="Avg. Deposit Amount"
                        price={averageCommitteeDeposit.length ? calculateAverageGroupSize(averageCommitteeDeposit) : 0}
                      />
                    </div>
                    <div className={styles.grid_item}>
                      <StatisticsCard
                        bgcolor="bgpink"
                        title="Total Committees"
                        price={committeeData ? committeeData.length : 0}
                      />
                    </div>
                    <div className={styles.grid_item}>
                      <StatisticsCard
                        bgcolor="bgblue"
                        title="Completed Committees"
                        price='0'
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className={`${styles.statistic_user} pt-30`}>
              <Card className='cstmcard'>
                <Card.Body>
                  <div className='title_sml'>
                    <h3>Login Statistics</h3>
                  </div>
                  <div className={styles.grid_main}>
                    <div className={styles.grid_item}>
                      <StatisticsCard
                        bgcolor="bgblue"
                        title="Avg. Daily Logins"
                        price={avgDailyLogin ? avgDailyLogin : 0}
                      />
                    </div>
                    <div className={styles.grid_item}>
                      <StatisticsCard
                        bgcolor="bgorange"
                        title="Avg. Weekly Logins "
                        price={avgWeeklyLogin ? avgWeeklyLogin : 0}
                      />
                    </div>
                    <div className={styles.grid_item}>
                      <StatisticsCard
                        bgcolor="bgpink"
                        title="Avg. Monthly Logins"
                        price={avgMonthlyLogin ? avgMonthlyLogin : 0}
                      />
                    </div>
                    <div className={styles.grid_item}>
                      <StatisticsCard
                        bgcolor="bgsky_light"
                        title="Avg. Yearly Logins"
                        price={avgYearlyLogin ? avgYearlyLogin : 0}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
        {/* overlay box */}
        <div className='overlay_bg'></div>
        {/* overlay end */}
      </main>
    </>
  )
}

export default Dashboard
