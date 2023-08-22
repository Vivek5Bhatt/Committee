"use client"
import styles from "../../../style/dashboard.module.scss";

const StatisticsCard = ({ title, price, bgcolor }) => {
  return (
    <>
      <div className={`${styles.card_bxnew} ${bgcolor} multi_cardbx`}>
        <div
          className={`${styles.card_innerbx} d-flex align-items-center flex-wrap`}
        >
          <div className={styles.box1}>
            <h4 className="card_smltitle">{title}</h4>
          </div>
          <div className={styles.box2}>
            <div className="price_usd">{price}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StatisticsCard;
