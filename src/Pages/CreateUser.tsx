import React, { useState } from "react";
import { TextField, Button, Box, MenuItem } from "@mui/material";
import { createUser } from "../Services/API/apiService";

const CreateUser = () => {
  const initialFormData = {
    firstName: "",
    lastName: "",
    userId: "",
    password: "",
    role: "user",
  };
  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({
    userId: false,
    password: false,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { userId, password } = formData;

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
          userId: false,
          password: false,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        fullWidth
        margin="normal"
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
