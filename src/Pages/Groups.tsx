import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import * as React from "react";
import { Component } from "react";
import { FiSend } from "react-icons/fi";
import { createGroup, getGroupListByUser } from "../Services/API/apiService";
import { ActionType, GlobalContext } from "../Services/Providers/GlobalContext";
import { useNavigate } from "react-router-dom";
function Groups() {
  const [newGroupName, setNewGroupName] = React.useState("");
  const [global, dispatch] = React.useContext(GlobalContext);
  const [groups, setGroups] = React.useState([]);
  const handleMessageChange = (e: any) => {
    setNewGroupName(e.target.value);
  };
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch({
      type: ActionType.SET_GROUP_NAME,
      payload: { groupName: "All Groups" },
    });
    getGroupListByUserId();
  }, []);

  const getGroupListByUserId = () => {
    getGroupListByUser(global?.currentUser.userId).then(
      (res) => {
        console.log(res);

        setGroups(
          res.data.sort(function (x: any, y: any) {
            return y.timestamp - x.timestamp;
          })
        );
      },
      (errors) => {
        console.log(errors);
      }
    );
  };

  const groupCreate = () => {
    createGroup({
      groupName: newGroupName,
      participants: [global?.currentUser.userId],
      creatorId: global?.currentUser.userId,
    }).then((res) => {
      console.log(res, "groupCreated");
      getGroupListByUserId();
      alert(res.message);
    });
  };
  return (
    <Box display="flex" flexDirection={"column"} height={"100%"}>
      <Box className="chat-input">
        <input
          type="text"
          placeholder="Add New Group Name"
          value={newGroupName}
          onChange={handleMessageChange}
        />
        <Button
          onClick={groupCreate}
          disabled={newGroupName.length == 0}
          sx={{ padding: "0px!important" }}
        >
          <Box sx={{ fontSize: "24px", color: "white" }}>+</Box>
        </Button>
      </Box>

      <Box className="groupContainer">
        {groups.map((group: any, index) => {
          return (
            <Card
              variant="outlined"
              sx={{ margin: "5px" }}
              key={group.roomId}
              onClick={() => {
                dispatch({
                  type: ActionType.SET_GROUP_NAME,
                  payload: { groupName: group.groupName },
                });
                navigate(`/dashboard/groupchat/${group.roomId}`);
              }}
            >
              <CardContent>
                <Typography component="div">
                  Group Name: {group.groupName}
                </Typography>
                <Typography color="text.secondary">
                  Created By: {group.creatorId}
                </Typography>
                <Typography color="text.secondary">
                  Participants : {group.participants.length}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}

export default Groups;
