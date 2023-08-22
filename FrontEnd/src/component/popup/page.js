"use client"
import React from "react";
import Image from 'next/image';
import avatar2 from 'public/images/avtar2.svg';
// import plusGrey from 'public/images/plus-grey.svg';
// import styles from '../../../app/style/dashboard.module.scss';
import Button from 'react-bootstrap/Button';
import "./popup.css";

const Popup = ({ text, closePopup, data, handleAddMember }) => {
    const handlePluseClick = (email) => {
        handleAddMember(email)
    }

    const handleMinusClick = (email) => {
        handleRemoveMember(email)
    }

    return (
        <div className="popup-container">
            <div className="popup-body">
                <h1>{text}</h1>
                <Button onClick={() => closePopup()}>Close X</Button>
                {data?.map(i => <div key={i.email}>
                    <Image
                        src={avatar2}
                        alt='add-icon'
                        width={40}
                        height={40}
                    />
                    {i.name}
                    <input type="checkbox" onClick={() => handlePluseClick(i.email)} />
                    {/* <Button onClick={()=>handlePluseClick(i.email)}>
                    <Image
                        src={plusGrey}
                        alt='add-icon'
                        width={8}
                    />
                    </Button> */}
                </div>
                )}
            </div>
        </div>
    );
};

export default Popup