"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from '../../style/form.module.scss';
import Stack from 'react-bootstrap/Stack';
import Logowhite from 'public/images/logo-white.svg';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const ResetPassword = () => {
  const router = useRouter()

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
                <h1 className={`${styles.title_md} fs-28 fw-700 secondary_color text-center`}>Recover Password</h1>
                <p className={`${styles.subtitle} fs-14 text-center`}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.</p>
                <div className={styles.forminner}>
                  <Form className='cstm_formbx'>
                    <Form.Group className="form_cstm mb-3" controlId="exampleForm.ControlTextarea1">
                      <Form.Label>New password</Form.Label>
                      <Form.Control type="password" placeholder="************" />
                    </Form.Group>
                    <Form.Group className="form_cstm mb-3" controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Confirm new password</Form.Label>
                      <Form.Control type="password" placeholder="************" />
                    </Form.Group>
                    <div>
                      <Button variant="primary" size="md" className='w-100' onClick={() => router.push('/')}>
                        Update Password
                      </Button>
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
