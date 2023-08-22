"use client"
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const InviteModal = (props) => {
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
            Invite new user
          </Modal.Title>
        </Modal.Header>
        <Form className='cstm_formbx form_md'>
          <Modal.Body>
            <Form.Group className="form_cstm mb-3">
              <Form.Label>phone number</Form.Label>
              <Form.Control type="text" placeholder="Enter phone number/email" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <div className='btnbottom w-100' >
              <Button variant="primary" size="md" className='w-100'>
                Send Invitation
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default InviteModal;