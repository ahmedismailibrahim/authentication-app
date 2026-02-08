import { Link } from "react-router-dom";
import styles from "../../styles/Form.module.css";
import { useState } from "react";
import { useRegisterMutation } from "../../redux/features/auth/authApiSlice";
import Cookies from "js-cookie";
import {useNavigate } from 'react-router-dom';
const Signup = () => {
    const navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });


  const [errors, setErrors] = useState({});

  const [register, { isError, error }] = useRegisterMutation();
  

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const validate = () => {
      const errors = {};
      // First name validation
    if (!userInput.first_name.trim()) {
      errors.first_name = "First name is required";
      }
      // Last name validation
    if (!userInput.last_name.trim()) {
      errors.last_name = "Last name is required";
      }
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
        const { data } = await register(userInput);
        const accessToken = data?.accessToken;
        console.log("Signup successful, access token:", accessToken);
        if (accessToken) {
          // Store the token in cookies or localStorage
          Cookies.set("accessToken", accessToken, { expires: 7 }); // Expires in 7 days
          // rest 
          setUserInput({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
          });
          navigate("/dashboard");
        }
        
      }
    } catch (err) {
      console.error("Signup failed:", err);
    };
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Create Account</h2>

        <div className={styles.group}>
          <label className={styles.label}>first_name</label>
          <input
            className={styles.input}
            placeholder="Your first name"
            value={userInput.first_name}
            onChange={handleChange}
            name="first_name"
                  />
                  {errors.first_name && <p className={styles.error}>{errors.first_name}</p>}
        </div>

        <div className={styles.group}>
          <label className={styles.label}>last_name</label>
          <input
            className={styles.input}
            placeholder="Your last name"
            value={userInput.last_name}
            name="last_name"
            onChange={handleChange}
                  />
                    {errors.last_name && <p className={styles.error}>{errors.last_name}</p>}
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
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
            placeholder="Password"
            value={userInput.password}
            name="password"
            onChange={handleChange}
                  />
                    {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        <button className={styles.button}>Sign Up</button>

        <p className={styles.text}>
          Already have an account?{" "}
          <Link className={styles.link} to="/auth/login">
            Login
          </Link>
        </p>
        {isError && <p className={styles.error}>{error?.data?.message || "Signup failed"}</p>}
      </form>
    </div>
  );
};

export default Signup;
