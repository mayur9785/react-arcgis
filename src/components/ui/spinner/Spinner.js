import React from "react";
import styles from "./Spinner.module.css";
const Spinner = ({ loadingMessage }) => {
  return (
    <div>
      <div className={styles.Overlay}></div>
      <div className={styles.CenterContainer}>
        <b className={styles.CenterContainer} style={{ color: "#d00205" }}>
          {loadingMessage ? loadingMessage : "Loading..."}
        </b>
        <div className={styles.Loader}></div>
      </div>
    </div>
  );
};

export default Spinner;
