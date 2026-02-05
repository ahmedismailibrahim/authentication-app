import styles from "../../styles/form.module.css";
// import {Link} from 'react-router-dom';

const LoginForm = () => {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h2 className={styles.title}>Login</h2>

        <div className={styles.group}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            placeholder="Enter email"
          />
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            placeholder="Enter password"
          />
        </div>

        <button className={styles.button}>Login</button>

        <p className={styles.text}>
          Don’t have an account? <span className={styles.link}>Sign up</span>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
