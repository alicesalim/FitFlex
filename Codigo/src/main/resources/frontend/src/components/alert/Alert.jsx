import React, { useEffect } from 'react';
import styles from './Alert.module.css';

const Alert = ({ message, type, onClose, autoClose = true }) => {
  useEffect(() => {
    if (autoClose && message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [message, onClose, autoClose]);

  if (!message) return null;

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <p>{message}</p>
      <button className={styles.closeButton} onClick={onClose}>×</button>
    </div>
  );
};

export default Alert; 