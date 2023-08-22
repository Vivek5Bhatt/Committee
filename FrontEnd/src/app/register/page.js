"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from '../../style/form.module.scss';
import Stack from 'react-bootstrap/Stack';
import Logowhite from 'public/images/logo-white.svg';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import dashify from 'dashify';
import axios from 'axios';

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    country: "",
    phone: "",
    dateOfBirth: "",
    password: ""
  })

  const router = useRouter()

  const getUserData = (event) => {
    const { name, value } = event.target
    setUser({ ...user, [name]: value })
  }

  const postData = async (e) => {
    e.preventDefault()
    const { name, email, phone, password } = user
    await axios.post('/api/entry', { name, role: dashify(name), email, password });
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
                <h1 className={`${styles.title_md} fs-28 fw-700 secondary_color text-center`}>Register</h1>
                <p className={`${styles.subtitle} fs-14 text-center`}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.</p>
                <div className={styles.forminner}>
                  <Form className='cstm_formbx'>
                    <Form.Group className="form_cstm mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter name"
                        name='name'
                        value={user.name}
                        onChange={getUserData}
                      />
                    </Form.Group>
                    <Form.Group className="form_cstm mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email address"
                        name="email"
                        value={user.email}
                        onChange={getUserData}
                      />
                    </Form.Group>
                    <Form.Group className="form_cstm mb-3">
                      <Form.Label>Country</Form.Label>
                      <Form.Select aria-label="Default select example" className='form-control'>
                        <option>Select country</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="form_cstm mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Phone number</Form.Label>
                      <Form.Control type="text" placeholder="Enter phone number" name="phone" value={user.phone} onChange={getUserData} />
                    </Form.Group>
                    <Form.Group className="form_cstm mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Date of birth</Form.Label>
                      <Form.Control type="text" placeholder="Enter phone number" name='dateOfBirth' value={user.dateOfBirth} onChange={getUserData} />
                    </Form.Group>
                    <Form.Group className="form_cstm mb-3" controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="************" name='password' value={user.password} onChange={getUserData} />
                    </Form.Group>
                    <Row className="form_policy_bx form_cstm mb-4">
                      <Form.Group className="form_checkbx" id="formGridCheckbox">
                        <Form.Check type="checkbox" label="Remember me" />
                        <div className='form_policy'>
                          <Link href="#">
                            Terms
                          </Link>
                          <span> & </span>
                          <Link href="#">
                            Privacy Policy
                          </Link>
                        </div>
                      </Form.Group>
                    </Row>
                    <div>
                      {/* <Button  variant="primary" size="md" className='w-100'  onClick={() => router.push('/confirmation')}> */}
                      <Button variant="primary" size="md" className='w-100' onClick={postData}>
                        Continue
                      </Button>
                    </div>
                    <div className={`${styles.form_bottom} form_botm_btn`}>
                      <p className={styles.form_bottom_btnlik}>Already have an account? <Link href="/">Login</Link></p>
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

export default Register
