"use client"
import Image from 'next/image';

const NotificationComponent = (props) => {
    const { imagebx, title, subtitle, time } = props

    return (
        <>
            <div className="notification_card">
                <div className="notification_cardbx d-flex align-items-center flex-wrap">
                    <div className='notification_profile'>
                        <div className='notification_avtar'>
                            <Image
                                src={imagebx}
                                width={45}
                                height={45}
                                alt='avtar1'
                            />
                        </div>
                    </div>
                    <div className='notification_contentbx text-truncate'>
                        <h4 className='text-truncate'>{title}</h4>
                        <p className='text-truncate'>{subtitle}</p>
                    </div>
                    <div className='notification_time'>
                        <div className='notification_time_detail'>
                            {time}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotificationComponent;