
"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from '../../style/form.module.scss';
import Stack from 'react-bootstrap/Stack';
import Logowhite from 'public/images/logo-white.svg';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const auth = getAuth();

  const router = useRouter()

  const triggerResetEmail = async () => {
    setEmailError(validate(email))
    if (email) {
      await sendPasswordResetEmail(auth, email)
        .then(a => {
          router.push('/')
        })
        .catch(e => {
          if (e.message.includes('invalid-email')) {
            setEmailError("Please enter valid email address !")
          }
          if (e.message.includes('user-not-found')) {
            setEmailError('User-not-found !')
          }
        })
    }
  }
  const validate = (values) => {

    if (!values) {
      const errors = "Email is required !"
      return errors
    }

  }

  return (
    <>
      <main className={styles.main}>
        <Stack direction="horizontal" className="formstack">
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
                <h1 className={`${styles.title_md} fs-28 fw-700 secondary_color text-center`}>Forgot Password</h1>
                <p className={`${styles.subtitle} fs-14 text-center`}>Enter your email address to get link.</p>
                <div className={styles.forminner}>
                  <Form className='cstm_formbx'>
                    <Form.Group className="form_cstm mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                      <p className='text-error'> {emailError} </p>
                    </Form.Group>
                    <div>
                      <Button variant="primary" size="md" className='w-100' onClick={triggerResetEmail}>
                        Continue
                      </Button>
                    </div>
                    <div className={`${styles.form_bottom} form_botm_btn back_login_btn`}>
                      <Link href="/">
                        <span className='icon_arrow'>
                          <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.25897 2.11297C6.53645 1.83549 6.53645 1.38561 6.25897 1.10813C5.9815 0.830655 5.53161 0.830655 5.25413 1.10813L0.208353 6.15391C0.134253 6.22802 0.0799408 6.31441 0.0454173 6.40653C0.0169462 6.48232 0.0010507 6.56425 0.000273995 6.6498C0.000253932 6.652 0.000243979 6.65419 0.000244143 6.65639C0.000244143 6.7627 0.0235939 6.86356 0.0654448 6.95412C0.0896625 7.00662 0.120627 7.05677 0.158338 7.10327C0.175565 7.12454 0.193998 7.14479 0.213529 7.16393L5.25413 12.2045C5.53161 12.482 5.9815 12.482 6.25897 12.2045C6.53645 11.9271 6.53645 11.4772 6.25897 11.1997L2.42619 7.36692H17.2898C17.6822 7.36692 18.0003 7.0488 18.0003 6.65639C18.0003 6.26397 17.6822 5.94586 17.2898 5.94586H2.42609L6.25897 2.11297Z" fill="#0B1F50" />
                          </svg>
                        </span>Back to Login</Link>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </Stack>
      </main>
    </>
  )
}

export default ResetPassword
