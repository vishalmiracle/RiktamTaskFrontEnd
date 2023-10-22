import React, { useEffect, useState } from "react";
import { Box, Button, Input, Typography } from "@mui/material";
import { ActionType, GlobalContext } from "../Services/Providers/GlobalContext";
import { FiLogOut, FiMessageSquare, FiUser, FiUserMinus, FiUsers } from "react-icons/fi";
import { Route, Router, Routes, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import CreateUser from "./CreateUser";
import GroupChat from "./GroupChat";
import Groups from "./Groups";
import GroupSetting from "./GroupSetting";

const menus = [
  {icon:<FiUsers fontSize={"24px"}/>,value:"groups"},
  { icon: <FiMessageSquare fontSize={"24px"} />, value: "groupChat" },
  { icon: <FiUser fontSize={"24px"} />, value: "createUser" },
  // { icon: <FiUserMinus fontSize={"24px"} />, value: "deleteUser" },
];
function Dashboard() {
  const [global, dispatch] = React.useContext(GlobalContext);

  const [selectedMenu, setSelectedMenu] = useState(menus[0].value);

  const navigate = useNavigate();

  const logout = () => {
    dispatch({
      type: ActionType.SET_CURRENT_USER,
      payload: {},
    });

    dispatch({
      type: ActionType.SET_GROUP_NAME,
      payload: { groupName: "All Groups" },
    });
    dispatch({
      type: ActionType.SET_AUTHENTICATION,
      payload: { validSession: false },
    });
    navigate("/login");
  };

  return (
    <>
      <Box className="container">
        <Box className="chat-container">
          <Box className="toolbar">
            <Box component={"span"}>
            <Typography fontSize={"20px"}>
               {global?.groupName}
               </Typography>
               </Box>
            <Box
              component={"span"}
              display={"flex"}
              sx={{ alignItems: "center" }}
            >
              <Typography>
              {global?.currentUser.firstName +
                " " +
                global?.currentUser.lastName}
              </Typography>
             

              <Button onClick={logout}>
                <FiLogOut />
              </Button>
              {/* <FiLogOut
                fontSize={"16px"}
                style={{ paddingRight: "10px", cursor: "pointer" }}
                onClick={logout}
              /> */}
            </Box>
          </Box>

          <Box sx={{ height: "calc(100vh - 110px)" }}>
            <Routes>
            <Route path="groups" element={<Groups></Groups>} />
              <Route path="createUser" element={<CreateUser />} />
              <Route path="groupChat/:id" element={<GroupChat />} />
              <Route path="groupSetting/:id" element={<GroupSetting/>}/>
             
            </Routes>
          </Box>

          <Box display={"flex"} className="action-container">
            {menus.map((menu, index) => {
              return (
                <Button
                  key={menu.value}
                  sx={{
                    color:
                      selectedMenu == menus[index].value ? "white" : "#4caf50",
                    backgroundColor:
                      selectedMenu == menus[index].value
                        ? "#4caf50!important"
                        : "white!important",
                  }}
                  onClick={() => {
                    setSelectedMenu(menus[index].value);
                    if(selectedMenu==menus[0].value){
                      dispatch({
                        type: ActionType.SET_GROUP_NAME,
                        payload: { groupName: "All Groups" },
                      });
                    }
                   
                    navigate(menus[index].value);
                  }}
                >
                  {menu.icon}
                </Button>
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
