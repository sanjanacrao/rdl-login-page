import { useState, useEffect } from "react";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Grid, TextField, Card, Tooltip, Container, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ButtonAppBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          User Management
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loginHistory, setLoginHistory] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch("https://reqres.in/api/users?page=2")
      .then((res) => res.json())
      .then((data) => setLoginHistory(data.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleLogin = async () => {
    if (!firstName || !lastName) {
      toast.error("Enter both First and Last Name!");
      return;
    }

    const newUser = { first_name: firstName, last_name: lastName };
    try {
      const response = await fetch("https://reqres.in/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      setLoginHistory([...loginHistory, { ...data, id: loginHistory.length + 1 }]);
      setFirstName("");
      setLastName("");
      toast.success("User added successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to add user!");
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await fetch(`https://reqres.in/api/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUser),
      });
      setLoginHistory(loginHistory.map((u) => (u.id === editUser.id ? editUser : u)));
      setDialogOpen(false);
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://reqres.in/api/users/${id}`, { method: "DELETE" });
      setLoginHistory(loginHistory.filter((user) => user.id !== id));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user!");
    }
  };

  return (
    <Box>
      <ButtonAppBar />
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", backgroundColor: "#f4f4f4", p: 3 }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <Card sx={{ p: 3, textAlign: "center", width: "50%", minHeight: "400px" }}>
          <Typography variant="h5" gutterBottom>Login</Typography>
          <TextField fullWidth margin="normal" label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <TextField fullWidth margin="normal" label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>Login</Button>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Login History</Typography>
          <Box sx={{ maxHeight: 230, overflowY: "auto", p: 1 }}>
            {loginHistory.map((user) => (
              <Grid container key={user.id} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>{user.first_name} {user.last_name} - ID: {user.id}</Typography>
                <Box>
                  <Tooltip title="Edit User">
                    <IconButton color="primary" size="small" onClick={() => handleEditClick(user)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton color="error" size="small" onClick={() => handleDelete(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            ))}
          </Box>
        </Card>
      </Container>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="First Name" value={editUser?.first_name || ''} onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })} />
          <TextField fullWidth margin="normal" label="Last Name" value={editUser?.last_name || ''} onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
