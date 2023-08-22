"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from '../style/form.module.scss';
import Stack from 'react-bootstrap/Stack';
import Logowhite from 'public/images/logo-white.svg'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Loader from '../component/loader/page';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCookie, getCookie } from 'cookies-next';

const Login = () => {
  const [loader, setLoader] = useState(false)
  const [checked, setChecked] = useState(false)
  const [loginError, setLoginError] = useState({})
  const [users, setUsers] = useState([])
  const [loginDetail, setLoginDetail] = useState({
    email: getCookie("myapp-email") || "",
    password: getCookie("myapp-password") || ""
  })

  const router = useRouter()

  // Funcation For Remember Me-------------->
  const rememberMe = () => {
    if (checked) {
      setCookie("myapp-email", loginDetail.email);
      setCookie("myapp-password", loginDetail.password)
    } else {
      setCookie("myapp-email", "");
      setCookie("myapp-password", "")
    }
  }

  // Funcation to get User data from firestore.... Start
  const getUsersData = async () => {
    const db = getFirestore();
    const colRef = collection(db, "Users");
    const docsSnap = await getDocs(query(colRef, where('role', '==', 'Admin')))
    let userData = []
    docsSnap.forEach(doc => {
      userData.push({ docId: doc.id, ...doc.data() })
    })
    setUsers(userData)
  }

  //Funcation to get User data from firestore.... End
  const handleChange = (event) => {
    try {
      const { name, value } = event.target
      setLoginDetail({ ...loginDetail, [name]: value })
    } catch (error) {
      return error
    }
  }

  const validate = (values) => {
    const errors = {}
    if (!values.email) {
      errors.email = "Email is required !"
    }
    if (!values.password) {
      errors.password = "Password is required !"
    }
    return errors
  }

  const handleSubmit = () => {
    try {
      // for valideation....................Start
      setLoginError(validate(loginDetail))
      // for valideation....................End
      if (loginDetail.email && loginDetail.password) {
        const adminUser = users.find(user => user.email === loginDetail.email)
        if (adminUser) {
          if (adminUser.role === "Admin") {
            setLoader(!loader)
            const auth = getAuth();
            signInWithEmailAndPassword(auth, loginDetail.email, loginDetail.password)
              .then((userCredential) => {
                setCookie('AdminImage', adminUser.image)
                setCookie("AdminName", adminUser.name)
                setCookie("AdminUid", userCredential.user.uid);
                setCookie("AdminEmail", userCredential.user.email)
                rememberMe()
                router.push('/dashboard')
              })
              .catch((error) => {
                setLoginError({ password: 'Please enter valid password!' })
                setLoader(loader)
              });
          } else {
            setLoginError({ admin: 'Only Admin can login!' })
            // toast("Only Admin can login!", {
            //   autoClose: 2000,
            //   hideProgressBar: true,
            //   theme: "dark",
            // });
          }
        } else {
          setLoginError({ email: 'Please enter registered email' })
          // toast("User Not Found!", {
          //   autoClose: 2000,
          //   hideProgressBar: true,
          //   theme: "dark",
          // });
          setLoader(loader)
        }
      }
    } catch (error) {
      return error
    }
  }

  useEffect(() => {
    getUsersData()
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <main className={styles.main} >
        <Stack direction="horizontal" className="formstack" >
          <div className={styles.leftcard}>
            <div className={styles.bgbox}>
              <Link href="#">
                <Image
                  src={Logowhite}
                  width={300}
                  alt="logo"
                />
              </Link>
            </div>
          </div>
          <div className={styles.rightcard}>
            <div className={styles.rightformbx}>
              <div className={styles.rightbodybx}>
                <h1 className={`${styles.title_md} fs-28 fw-700 secondary_color text-center`}>Welcome</h1>
                <p className={`${styles.subtitle} fs-14 text-center`}>Log in to your account</p>
                <div className={styles.forminner}>
                  <p className='text-error'> {loginError.admin} </p>
                  <Form className='cstm_formbx'>
                    <Form.Group className="form_cstm mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email address"
                        name='email'
                        value={loginDetail.email}
                        onChange={handleChange}
                        required
                      />
                      <p className='text-error'> {loginError.email} </p>
                    </Form.Group>
                    <Form.Group className="form_cstm mb-3" controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password"
                        placeholder="Enter your password"
                        name='password'
                        value={loginDetail.password}
                        onChange={handleChange}
                        required
                      />
                      <p className='text-error'> {loginError.password} </p>
                    </Form.Group>
                    <Row className="form_cstm mb-4">
                      <Form.Group as={Col} className="form_checkbx" id="formGridCheckbox">
                        <Form.Check type="checkbox" label="Remember me" onClick={() => setChecked(true)} />
                      </Form.Group>
                      <Form.Group as={Col} className="form_forgot text-end" controlId="exampleForm.ControlTextarea1">
                        <Link href="/forgotpassword">
                          Forgot Password?
                        </Link>
                      </Form.Group>
                    </Row>
                    <div>
                      {
                        !loader ? <Button variant="primary" size="md" className='w-100' onClick={handleSubmit}>
                          Login
                        </Button> : <Loader />
                      }
                    </div>
                    {/* <div className={`${styles.form_bottom} form_botm_btn`}>
                          <p className={styles.form_bottom_btnlik}>Don’t have an account? <Link href="/register">Register now</Link></p>
                        </div> */}
                  </Form>
                </div>
              </div>
              {/* :
                  <div className={styles.rightbodybx}>
                    <h1 className={`${styles.title_md} fs-28 fw-700 secondary_color text-center`}>Enter OTP</h1>
                    <p className={`${styles.subtitle} fs-14 text-center`}>OTP has been to your registered mobile number.</p>
                    <p className={`${styles.subtitles_small} fs-14 text-center `}>{adminPhone}</p>
                    <div className={styles.forminner}>
                      <Form className='cstm_formbx'>
                        <Form.Group className="form_cstm" controlId="exampleForm.ControlInput1">
                          <Form.Label>Enter 6 digits code</Form.Label>
                        </Form.Group>
                        <Row className="form_cstm form_otp mb-4 rowgap">
                          <OtpInput value={verificationCode} onChange={setVerificationCode} autoFocus OTPLength={6} otpType="text" disabled={false} />
                        </Row>
                        <div>
                          <Button variant="primary" size="md" className='w-100' onClick={handleVerifyCode}>
                            Continue
                          </Button>
                        </div>
                        <div className={`${styles.form_bottom} form_botm_btn otp_frm_botom`}>
                          <p className={styles.form_bottom_btnlik}>Didn't received any OTP?</p>
                          <p> <Link href="#">Resend again</Link></p>
                        </div>
                      </Form>
                    </div>
                  </div> */}
            </div>
          </div>
        </Stack>
      </main>
    </>
  )
}

export default Login
