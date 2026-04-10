import React, { useState } from 'react';
import styles from "@/components/ui/slider-checkbox.module.css";

const SliderCheckbox = ({checked, toggleChecked}) => {

  return (
    <div
      className={`${styles.slider} ${checked ? styles.checked : ''}`}
      onClick={toggleChecked}
    >
      <div className={styles.circle}></div>
    </div>
  );
};

export default SliderCheckbox;
