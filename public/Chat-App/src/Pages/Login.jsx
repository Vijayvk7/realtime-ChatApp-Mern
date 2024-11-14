import { React, useState } from "react";
import logo from "../assets/logo.png";
import styled from "styled-components";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../Utils/ApiRoutes";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, password } = values;
      try {
        const { data } = await axios.post(loginRoute, {
          username,
          password,
        });
        if (data.status === true) {
          localStorage.setItem("chat-app-user", JSON.stringify(data.User));
          navigate("/setAvatar");
        }
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to Login user. Try again.", toastOptions);
      }
    }
  };

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;
    if (username.length === "") {
      toast.error("UserName is Required", toastOptions);
      return false;
    } else if (username.length <= 3) {
      toast.error(
        "Username Should be Greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password == "") {
      toast.error("Password is Required", toastOptions);
      return false;
    } else if (password.length < 7) {
      toast.error(
        "Password Should be Greater than 3 characters.",
        toastOptions
      );
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  return (
    <>
      <FormContainer>
        <div className="brand">
          <img src={logo} alt="" />
          <h1>Vk ChatApp</h1>
        </div>
        <form>
          <input
            type="text"
            placeholder="UserName"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit" onClick={(e) => handleSubmit(e)}>
            Log In
          </button>
          <span>
            Don't having an account ? <Link to="/register">Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.2rem;
  align-items: center;
  background-color: #131324;

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -70px;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
      margin-left: -50px;
    }
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Login;
