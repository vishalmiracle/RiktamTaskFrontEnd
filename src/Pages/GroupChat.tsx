import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { createUser, sendMessage, updateMessage } from "../Services/API/apiService";
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
  like: string[];
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

        handleJoinRoom();
      });
      socket.on("messageHistory", (history: Message[]) => {

        setMessages(history);
      });

      socket.on("message", (newMessage: Message) => {

        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      socket.on("updateMessage", (updateMessIN:any) => {
       const updateMess=updateMessIN._doc
     
        

        setMessages(prevMessages => {
          return prevMessages.map(participant => {
            if (participant._id === updateMess._id) {
         
              return { ...participant, ...updateMess };
            }
            return participant; // For other participants, return them unchanged
          });
        });
      });
    }
  }, [socket]);

  const handleJoinRoom = () => {

    if (socket && roomId) {
      socket.emit("joinRoom", roomId);
    }
  };
  const handleSendMessage = async() => {
   const res= await sendMessage({ roomId, message, senderId }).then(res=>{
    setMessage("");
   },err=>{
    alert("Please try again")
   })
    // if (roomId && message) {
    //   fetch(`http://localhost:4001/api/sendMessage`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ roomId, message, senderId }),
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       // Handle the response if needed
    //     })
    //     .catch((error) => {
    //       console.error("Error:", error);
    //     });

     
    // }
  };
  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };

  const checkIsMessageLike = (message: Message) => {
    const usersLike = message.like;
    for (let i = 0; i < usersLike.length; i++) {
      if (usersLike[i] === global.currentUser.userId) {
        return true;
      }
    }
    return false;
  };

  const HeartIcon = () => {
    const iconStyles = {
      fill: "red", // Set the fill color to red
    };

    return <FiHeart style={iconStyles} />;
  };

  const handleUpdateMessage = (message:Message,add:boolean) => {
    updateMessage({
      roomId: message.roomId,
      participant: global.currentUser.userId,
      _id: message._id,
      add:add
    }).then(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  return (
    <Box>
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
              <Typography className="message-text">{mess.message}</Typography>
              {checkIsMessageLike(mess) ? <Box sx={{cursor:"pointer"}} onClick={()=>{handleUpdateMessage(mess,false )}}><HeartIcon /></Box> : <FiHeart
             style={{cursor:"pointer"}} 
              onClick={()=>{handleUpdateMessage(mess,true)}} />}
              {(mess.like.length>0) &&<Typography>
              {mess.like.length}
              </Typography>}
           
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
          maxLength={150}
        />
        <Button onClick={handleSendMessage} disabled={message.length == 0}>
          <FiSend />
        </Button>
      </Box>
    </Box>
  );
}

export default GroupChat;
