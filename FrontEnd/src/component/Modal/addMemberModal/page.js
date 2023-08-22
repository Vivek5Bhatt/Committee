"use client"
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InviteMember from '../../inviteMember/page';
import avtar1 from 'public/images/avtar1.svg';
import { useState } from 'react';

const AddMemberModal = (props) => {
  const { data, member, setShowMemberList, setModalShow, setMember, newMember, setNewMember, type, checkedMember, setCheckedMember, handleRemoveMember } = props

  const [checked, setChecked] = useState([])

  const handleAddClick = () => {
    setShowMemberList(true)
    setModalShow(false)
    setMember([...checkedMember])
  }

  const handleClick = (id, name, image) => {
    const isExitMember = checkedMember.find((item) => item.uid === id)
    if (isExitMember) {
      const filterMember = checkedMember.filter((item) => item.uid !== id)
      setCheckedMember(filterMember)
      handleRemoveMember(name, id)
      if (type == 'edit') {
        setNewMember(filterMember)
      }
    } else {
      setCheckedMember(prev => [...prev, { userName: name, userImage: image, uid: id }])
      if (type == 'edit') {
        setNewMember(prev => [...prev, { userName: name, userImage: image, uid: id }])
      }
    }
  }

  return (
    <>
      <Modal className='cstm_modal add-member-modal '
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Member
          </Modal.Title>
        </Modal.Header>
        <Form className='cstm_formbx form_md'>
          <Modal.Body>
            <div className='member_add_listing'>
            </div>
            <ul className='cstm_checklist_bxx'>
              {
                data?.map((item, index) => (
                  <li key={index}>
                    <label className="cstm_checkbx">
                      <input type="checkbox" onClick={() => handleClick(item.uid, item.name, item.image)} checked={(member ? member.find((data) => data.uid === item.uid) : null)} />
                      <span className="checkmark"></span>
                      <div className='checkbx-innercard'>
                        <InviteMember
                          imagebx={item.image ? item.image : avtar1}
                          title={item.name}
                        />
                      </div>
                    </label>
                  </li>
                ))
              }
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <div className='btnbottom w-100 text-center add_member_bottom' >
              <Button variant="primary" size="sm" onClick={handleAddClick}>
                Add
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default AddMemberModal;