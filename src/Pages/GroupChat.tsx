import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { createUser } from "../Services/API/apiService";
import { Box, Button, Input, Typography } from "@mui/material";
import { ActionType, GlobalContext } from "../Services/Providers/GlobalContext";
import {
  FiLogOut,
  FiMessageSquare,
  FiSend,
  FiTrash2,
  FiUser,
  FiUserMinus,
  FiHeart,
} from "react-icons/fi";
import {
  Route,
  Router,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./Dashboard.css";
import CreateUser from "./CreateUser";
interface Message {
  _id: string;
  roomId: string;
  message: string;
  senderId: string;
}

const menus = [
  { icon: <FiMessageSquare fontSize={"24px"} />, value: "chat" },
  { icon: <FiUser fontSize={"24px"} />, value: "addUser" },
  { icon: <FiUserMinus fontSize={"24px"} />, value: "deleteUser" },
];
function GroupChat() {
  const [socket, setSocket] = useState<any | null>(null);
  const [global, dispatch] = React.useContext(GlobalContext);
  const { id } = useParams();
  const [roomId, setRoomId] = useState(id);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [senderId, setSenderId] = useState(global?.currentUser.userId);
  const [selectedMenu, setSelectedMenu] = useState(menus[0].value);

  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = socketIOClient("http://localhost:4001");

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", (data: any) => {
        console.log("connection");
        handleJoinRoom();
      });
      socket.on("messageHistory", (history: Message[]) => {
        console.log("messageHistory", history);
        setMessages(history);
      });

      socket.on("message", (newMessage: Message) => {
        console.log("message", newMessage);
        for(let i=0;i<messages.length;i++)
        {
            const localMessage=messages[i]
            if(localMessage._id== newMessage._id){
                

            }
        }
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      socket.on("updateMessage", (updateMess: Message) => {
        console.log("updateMessage", updateMess);
        const localMessageList:Message[] = [...messages]
        for(let i=0;i<localMessageList.length;i++)
        {
            const localMessage=localMessageList[i]
            if(localMessage._id== updateMess._id){
                
                localMessageList[i]=updateMess;
                setMessages([...localMessageList])
            }
        }
  
      });
    }
  }, [socket]);

  const handleJoinRoom = () => {
    console.log("join", roomId, socket);
    if (socket && roomId) {
      socket.emit("joinRoom", roomId);
    }
  };
  const handleSendMessage = () => {
    if (roomId && message) {
      fetch(`http://localhost:4001/api/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId, message, senderId }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response if needed
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      setMessage("");
    }
  };
  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          navigate(`/dashboard/groupSetting/${roomId}`);
        }}
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "calc (100% - 10px)",
          padding: "5px",
          alignItems: "center",
          justifySelf: "center",
          marginTop: "5px",
        }}
      >
        <Typography>Manage Participants</Typography>
      </Button>
      <Box
        height={"calc(100vh - 200px)"}
        display={"flex"}
        flexDirection={"column"}
        sx={{ overflowY: "scroll" }}
      >
        {messages.map((mess, index) => {
          return (
            <Box
              className="message"
              key={mess.message + index + ""}
              sx={{
                justifyContent:
                  mess.senderId == global.currentUser?.userId
                    ? "right"
                    : "left",
              }}
            >
                
              <Box className="message-text">{mess.message}</Box>
              <FiHeart/>
              
            </Box>
          );
        })}
      </Box>

      <Box className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={handleMessageChange}
        />
        <Button onClick={handleSendMessage} disabled={message.length == 0}>
          <FiSend />
        </Button>
      </Box>
    </>
  );
}

export default GroupChat;
