"use client"
import Image from "next/image";

const InviteMember = ({ imagebx, title }) => {
    return (
        <>
            <div className="add_membercard_bx">
                <div className="notification_cardbx d-flex align-items-center flex-wrap">
                    <div className="notification_profile">
                        <div className="notification_avtar">
                            <Image src={imagebx} width={40} height={40} alt="avtar1" />
                        </div>
                    </div>
                    <div className="notification_contentbx text-truncate">
                        <h4 className="text-truncate">{title}</h4>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InviteMember;
