import styles from "../../styles/form.module.css";
import {Link} from 'react-router-dom';
import { useState } from "react";
import { useLoginMutation } from "../../redux/features/auth/authApiSlice";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {

  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [login, { isError, error }] = useLoginMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = {};
    // Email validation
    if (!userInput.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userInput.email)) {
      errors.email = "Email is invalid";
    }
    // Password validation
    if (!userInput.password) {
      errors.password = "Password is required";
    } else if (userInput.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validate()) {
        const { data } = await login(userInput);
        const accessToken = data?.accessToken;
        console.log("Login successful, access token:", accessToken);
        if (accessToken) {
          // Store the token in cookies or localStorage
          Cookies.set("accessToken", accessToken, { expires: 7 }); // Expires in 7 days
          // Navigate to dashboard or home page
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Login</h2>

        <div className={styles.group}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            placeholder="Enter email"
            name="email"
            value={userInput.email}
            onChange={handleChange}
          />
           {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            placeholder="Enter password"
            name="password"
            value={userInput.password}
            onChange={handleChange}
          />
           {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        <button className={styles.button}>Login</button>

        <p className={styles.text}>
          Don’t have an account? <Link className={styles.link} to="/auth/signup">Sign up</Link>
        </p>
        {isError && <p className={styles.error}>{error?.data?.message || "Login failed"}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
