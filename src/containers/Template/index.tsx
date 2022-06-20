import React from 'react';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

interface Props {
  children: React.ReactNode;
}

const Template: React.FC<Props> = ({ children }) => {
  return (
    <>
      <header className={styles.header}>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link to="/schedule" className={styles.link}>Schedule</Link>
          </li>

          <li className={styles.item}>
            <Link to="/cabinet" className={styles.link}>Cabinet</Link>
          </li>

          <li className={styles.item}>
            <Link to="/doctor" className={styles.link}>Doctor</Link>
          </li>

          <li className={styles.item}>
            <Link to="/patient" className={styles.link}>Patient</Link>
          </li>
        </ul>
      </header>

      <main className={styles.content}>
        {children}
      </main>
    </>
  );
};

export default Template;
