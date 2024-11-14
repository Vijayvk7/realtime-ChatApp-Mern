import React from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import Loader from "../assets/loader.gif";
const Welcome = ({ currentUser }) => {
  return (
    <Container>
      <img src={Robot} alt="Welcome" />
      <h1>
        Welcome <span>{currentUser.username}</span>
      </h1>
      <h3>Please Select a user to Chat</h3>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;

export default Welcome;
