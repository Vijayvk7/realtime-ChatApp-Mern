import { React, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import axios from "axios";
import { getallmessageRoute, sendMessageRoute } from "../Utils/ApiRoutes";
import { v4 as uuidv4 } from "uuid";

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessages, setArrivalMessages] = useState(null);
  const scrollRef = useRef();
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        try {
          const response = await axios.get(getallmessageRoute, {
            params: {
              from: currentUser._id,
              to: currentChat._id,
            },
          });
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    if (currentUser && currentChat && socket) {
      socket.emit("joinRoom", {
        room: `${currentUser._id}-${currentChat._id}`,
        user: currentUser,
      });
    }
  }, [currentChat, currentUser, socket]);

  const handleSendMsg = async (msg) => {
    try {
      const response = await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);

      const fetchMessages = async () => {
        if (currentChat) {
          try {
            const response = await axios.get(getallmessageRoute, {
              params: {
                from: currentUser._id,
                to: currentChat._id,
              },
            });
            setMessages(response.data);
          } catch (error) {
            console.error("Error fetching messages:", error);
          }
        }
      };

      socket.emit("message", {
        room: `${currentUser._id}-${currentChat._id}`,
        user: currentChat._id,
        text: msg,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        console.log("DATA Received : ", data.text);
        console.log("Before Concate: ", messages);
        console.log("Receiver ID: ", data.user._id);
        setMessages((prev) => [
          ...prev,
          { fromSelf: data.user._id === currentUser._id, message: data.text },
        ]);
        console.log("After", messages);
      });
    }
  }, [socket, currentUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <Container>
      {currentChat && (
        <>
          <div ref={scrollRef} key={uuidv4()} className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt=""
                />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="divider"></div>
        </>
      )}
      <div className="chat-messages">
        {messages.map((message, index) => {
          return (
            <div key={index}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "received"
                }`}
              >
                <div className="content">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 2px 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .divider {
    background-color: #ffffff39;
    height: 2px;
    width: 100%;
    margin: 0 0rem;
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatContainer;
