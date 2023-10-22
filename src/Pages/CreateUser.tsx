import React, { useEffect, useState } from "react";
import { TextField, Button, Box, MenuItem } from "@mui/material";
import { createUser, getUserList } from "../Services/API/apiService";
import { ActionType, GlobalContext } from "../Services/Providers/GlobalContext";

const CreateUser = () => {
  const initialFormData = {
    firstName: "",
    lastName: "",
    userId: "",
    password: "",
    role: "user",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [selectedUser,setSelectedUser]=useState('create');
  const [global, dispatch] = React.useContext(GlobalContext);
  const [userList, setUserList] = React.useState([]);
  const [errors, setErrors] = useState({
    firstName:false,
    lastName:false,
    userId: false,
    password: false,
  });

  useEffect(() => {
    dispatch({
      type: ActionType.SET_GROUP_NAME,
      payload: { groupName: "Add Participants" },
    });
    fetchUserList();
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const {firstName,lastName, userId, password } = formData;

    if (!firstName || firstName.trim() === "") {
      setErrors((prevErrors) => ({ ...prevErrors, firstName: true }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, firstName: false }));
    }

    if (!lastName || lastName.trim() === "") {
      setErrors((prevErrors) => ({ ...prevErrors, lastName: true }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, lastName: false }));
    }

    // Validate userId and password
    if (!userId || userId.trim() === "") {
      setErrors((prevErrors) => ({ ...prevErrors, userId: true }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, userId: false }));
    }

    if (!password || password.trim() === "") {
      setErrors((prevErrors) => ({ ...prevErrors, password: true }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: false }));
    }

    // If userId and password are valid, you can proceed with form submission or other actions
    if (userId && userId.trim() !== "" && password && password.trim() !== "") {
      create();
      // Perform form submission logic here
    }
  };

  const create = () => {
    if(selectedUser=="create")
    createUser({
      userId: formData.userId,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
    }).then(
      (res) => {
        console.log(res);
        alert(res.message);

        setFormData(initialFormData);
        setErrors({
          firstName:false,
          lastName:false,
          userId: false,
          password: false,
        });
      },
      (error) => {
        console.log(error);
      }
    );
    else {
      console.log("edit user")
    }
  };
  const setFormDataHandler=(user:any)=>{
    setFormData({firstName:user.firstName,lastName:user.lastName,role:user.role,userId:user.userId,password:""})
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        select
        label="Action"
        name="action"
        value={selectedUser}
        onChange={(e)=> setSelectedUser(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="create">Create</MenuItem>
        {userList &&
          userList.map((user:any) => {
            return <MenuItem key={user.userId} onClick={()=>{
            setFormDataHandler(user)
            }} value={user.userId}>{user.firstName+" "+user.lastName}</MenuItem>;
          })}
      </TextField>

      <TextField
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        helperText={errors.firstName ? "First Name is required" : ""}
      />
      <TextField
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        helperText={errors.lastName ? "Last Name is required" : ""}
      />
      <TextField
        label="User ID"
        name="userId"
        value={formData.userId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={errors.userId}
        helperText={errors.userId ? "User ID is required" : ""}
      />
      <TextField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={errors.password}
        helperText={errors.password ? "Password is required" : ""}
      />

      <TextField
        select
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="user">User</MenuItem>
      </TextField>

      <Box mt={2}>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default CreateUser;
