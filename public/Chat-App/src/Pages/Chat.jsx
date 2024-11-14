import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import axios from "axios";
import Contacts from "../Components/Contacts";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../Utils/ApiRoutes";
import Welcome from "../Components/Welcome";
import ChatContainer from "../Components/ChatContainer";
import { io } from "socket.io-client";
import ChatInput from "../Components/ChatInput";

const Chat = () => {
  const socket = useMemo(() => io("https://realtime-chatapp-mern.onrender.com"), []);

  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [Loaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        let curr = await localStorage.getItem("chat-app-user");
        if (curr) {
          curr = JSON.parse(curr);
          setCurrentUser(curr);
          setIsLoaded(true);
        }
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (currentChat) {
      const roomId = [currentUser._id, currentChat._id].sort().join("_");
      socket.emit("join-room", roomId);
    }
  }, [currentChat, currentUser, socket]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    setIsLoaded(false);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts
            contacts={contacts}
            currentUser={currentUser}
            changeChat={handleChatChange}
          />
          {Loaded ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
            />
          )}
        </div>
      </Container>
    </>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
