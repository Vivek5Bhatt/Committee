"use client";
import Image from "next/image";
import styles from "../../../style/dashboard.module.scss";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

const Usercard = ({ bgbox, onLink, subtitle, numcolor, number, icon }) => {
    const router = useRouter();

    return (
        <>
            <div
                className={`${styles.active_user} ${bgbox} cursor-pointer`}
                onClick={() => {
                    router.push(onLink);
                    if (subtitle === "Active Users") {
                        setCookie("user-active", "Active");
                    } else if (subtitle === "Active Committees") {
                        setCookie("committee-active", "Active");
                    }
                }}
            >
                <div
                    className={`${styles.active_user_inner} d-flex align-items-center flex-wrap dashbaord_cardinner`}
                >
                    <div className={styles.box1}>
                        <h3 className={styles.subtitle}>{subtitle}</h3>
                        <h5 className={`${styles.number} ${numcolor}`}>
                            {number}
                        </h5>
                    </div>
                    <div className={styles.box2}>
                        <div className={styles.imgbx}>
                            <Image src={icon} alt="search_icon" width={40} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Usercard;
