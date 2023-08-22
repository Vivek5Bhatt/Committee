"use client"
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const SendSmsModal = (props) => {
  return (
    <>
      <Modal className='cstm_modal'
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Send Sms
          </Modal.Title>
        </Modal.Header>
        <Form className='cstm_formbx form_md'>
          <Modal.Body>
            <Form.Group className="form_cstm mb-3">
              <Form.Label>User Name</Form.Label>
              <Form.Control type="text" value={props?.userData?.name} disabled />
            </Form.Group>
            <Form.Group className="form_cstm mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" value={`${props?.userData?.c_code} ${props?.userData?.phone?.split(" ")[1]}`} disabled />
            </Form.Group>
            <Form.Group className="form_cstm mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" placeholder="Please Enter Message Here" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <div className='btnbottom w-100' >
              <Button variant="primary" size="md" className='w-100' onClick={props.onHide}>
                Send
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default SendSmsModal;