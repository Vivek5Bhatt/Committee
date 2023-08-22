"use client"
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CloseImage from 'public/images/close-red.svg'
import Image from 'next/image';

const DeleteModal = (props) => {
  const { title } = props

  const handleDelete = () => {
    props.onDelete()
  }

  return (
    <>
      <Modal className='cstm_modal'
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {/* <Modal.Header closeButton></Modal.Header> */}
        <Form className='cstm_formbx form_md'>
          <Modal.Body>
            <div className="modal_innerbx">
              <div className='modal_imagebx text-center mb-3'>
                <Image src={CloseImage} alt="Close Iamge" width={65} height={65} />
              </div>
              <div className='modal_content_innerbx text-center pb-30'>
                <h4>Are you sure?</h4>
                <p>{title ? title : "This action will remove all the data related to this committee."}</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className='btnbottom w-100 d-flex gap_15 flex-wrap align-item-center' >
              <Button variant="secondary" size="md" className='w-100 flex-1' onClick={props.onHide}>
                Cancel
              </Button>
              <Button variant="primary" size="md" className={`w-100 flex-1 danger_bg ${title == 'Do you want to deactivate the committee?' ? `bg-DeactivateCommittee` :
                ''}`} onClick={handleDelete}>
                {
                  title == 'Do you want to deactivate the committee?' ? 'Deactivate' : "Delete"
                }

              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default DeleteModal;