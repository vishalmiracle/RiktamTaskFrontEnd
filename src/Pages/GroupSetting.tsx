import * as React from "react";
import { Component } from "react";
import { addParticipants, getGroupList, getUserList } from "../Services/API/apiService";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../Services/Providers/GlobalContext";
function GroupSetting() {
  const [userList, setUserList] = React.useState<any[]>([]);
  const [selectedParticipants, setSelectedParticipants] = React.useState<any>(
    []
  );
  const [searchTerm, setSearchTerm] = React.useState('');
  const { id } = useParams();
  const [roomId, setRoomId] = React.useState<string | undefined>(id);
  const [global, dispatch] = React.useContext(GlobalContext);
  const navigate = useNavigate();

  const handleCheckboxChange = (participant: any) => {
    console.log(participant);
    if (selectedParticipants.includes(participant)) {
      setSelectedParticipants(
        selectedParticipants.filter((p: any) => p !== participant)
      );
    } else {
      setSelectedParticipants([...selectedParticipants, participant]);
    }
  };

  const handleSubmit = async () => {
  
    console.log("Selected Participants:", selectedParticipants);

    await addParticipants({participants:selectedParticipants,roomId:roomId}).then(res=>{
        console.log(res)
        alert("Participants changed sucessfully");

    })
  };

  React.useEffect(() => {
    fetchUserList();
    fetUserListOfGroup();
  }, []);

  const fetchUserList = async () => {
    await getUserList().then(
      (res) => {
        console.log(res, "users");
        setUserList(res.data);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const fetUserListOfGroup = async () => {
    if (roomId)
      await getGroupList(roomId).then(
        (res) => {
          console.log(res);
          if (res.data.length == 0) {
            navigate("/dashboard");
          } else {
            setSelectedParticipants([...res.data[0].participants]);
          }
        },

        (error) => {
          console.log(error);
        }
      );
  };
  const filteredParticipants = userList.filter((participant) =>
    {
      
        const pName=participant.firstName+" "+participant.lastName 
       return pName.toLowerCase().includes(searchTerm.toLowerCase())}
  );

  return (
    <Box sx={{display:'flex',flexDirection:'column', width:'100%', height:'100%'}}>
       <TextField
        label="Search Participants"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Box>
        <FormGroup>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "calc( 100vh - 280px)",
              overflowY: "scroll",
            }}
          >
            <Typography color='orange' mt="10px" mb="10px">
                Select the user you want to stay / add in group or unselect to remove
            </Typography>
            {filteredParticipants.map((participant, index) => (
              <FormControlLabel
                key={participant.userId + index}
                control={
                  <Checkbox
                    checked={selectedParticipants.includes(participant.userId)}
                    onChange={() => handleCheckboxChange(participant.userId)}
                    disabled={participant.userId == global.currentUser.userId}
                  />
                }
                label={participant.firstName + " " + participant.lastName}
              />
            ))}
          </Box>
<Box display="flex"  sx={{justifyContent:"flex-end"}}>
          
          <Button variant="contained" color="secondary" onClick={()=>{navigate(`/dashboard/groupChat/${roomId}`)}}>
            Back
          </Button>
          
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ml:"20px"}}>
            Submit
          </Button> 
          </Box>
        </FormGroup>
      </Box>
    </Box>
  );
}

export default GroupSetting;
