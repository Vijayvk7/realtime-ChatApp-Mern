import React from "react";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
const Logout = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
};

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items;center;
  padding:0.5rem;
  border-radius:50%;
  background-color: #ffffff;
  border:none;
  cursor:pointer;
  svg{
  font-size:1.3rem;
  color:#497574;
  }
`;
export default Logout;
