import styles from "../../styles/Form.module.css";

const Signup = () => {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h2 className={styles.title}>Create Account</h2>

        <div className={styles.group}>
          <label className={styles.label}>Name</label>
          <input className={styles.input} placeholder="Your name" />
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} type="email" placeholder="Email" />
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
          />
        </div>

        <button className={styles.button}>Sign Up</button>

        <p className={styles.text}>
          Already have an account? <span className={styles.link}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
