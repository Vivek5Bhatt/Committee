
"use client"
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../style/form.module.scss';
import Stack from 'react-bootstrap/Stack';
import Logowhite from 'public/images/logo-white.svg';
import Emailicon from 'public/images/email_icon.svg';

const Confirmation = () => {
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
                <div className={styles.icontop}>
                  <Image
                    src={Emailicon}
                    width={116}
                    alt="email-icon"
                  />
                </div>
                <h1 className={`${styles.title_md} fs-28 fw-700 secondary_color text-center`}>Email Confirmation</h1>
                <p className={`${styles.subtitle} fs-14 text-center`}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.</p>
                <div className={styles.forminner}>
                  <div className={styles.resend_mail}>
                    <div className={styles.resend_mail_inner}>
                      If you not got any mail <Link href="/emailconfirmed" className='tex_link'> Resend Confirmation mail</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Stack>
      </main>
    </>
  )
}
export default Confirmation