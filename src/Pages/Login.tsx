import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { login } from "../Services/API/apiService";
import { useNavigate } from "react-router-dom";
import { ActionType, GlobalContext } from "../Services/Providers/GlobalContext";
import { User } from "../Utils/types";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [global, dispatch] = React.useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (global.validSession) {
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = () => {
    // Perform login logic here
    // You can validate username and password and handle authentication
    login({ userId: username, password: password }).then(
      (res) => {
        console.log(res.user);
        const currentUser: User = res.user;

        dispatch({
          type: ActionType.SET_CURRENT_USER,
          payload: { currentUser },
        });

        dispatch({
          type: ActionType.SET_GROUP_NAME,
          payload: { groupName:"Riktam" },
        });
        dispatch({
          type: ActionType.SET_AUTHENTICATION,
          payload: { validSession: true },
        });

        navigate("/dashboard");
      },
      (error) => {
        alert(error);
        console.log(error, "error");
      }
    );
    console.log(username, password, "values");
  };

  const validateForm = () => {
    let isValid = true;

    if (!username) {
      setUsernameError("Username is required");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Username"
        variant="outlined"
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={!!usernameError}
        helperText={usernameError}
        style = {{width: "350px"}}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!passwordError}
        helperText={passwordError}
        style = {{width: "350px"}}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => validateForm() && handleLogin()}
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;
