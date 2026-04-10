import React from 'react';
import styles from "./button.module.css";

const Button = ({children, onClick, className, type = "button"}) => {
    return (
        <button onClick={onClick} type={type} className={`${styles._} ${className || ''}`}>{children}</button>
    );
};

export default Button;