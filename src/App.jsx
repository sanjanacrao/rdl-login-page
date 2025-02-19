import { useState, useEffect } from "react";
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Grid, TextField, Card, Tooltip, Container, Menu, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ButtonAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/employee'); }}>Employee</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/customer'); }}>Customer</MenuItem>
        </Menu>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          User Management
        </Typography>
        <Button color="inherit" component={Link} to="/cart">
          <ShoppingCartIcon sx={{ mr: 1 }} /> Shopping Cart
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(data => setCart(data.slice(0, 6)))
      .catch(error => console.error("Error fetching cart:", error));
  }, []);

  const handleDelete = (id) => {
    setCart(cart.filter(item => item.id !== id));
    toast.success("Item removed from cart!");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => navigate(-1)}>Back</Button>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <Grid container spacing={2}>
        {cart.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <img src={item.image} alt={item.title} style={{ width: '100px', height: '100px' }} />
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="body2">${item.price}</Typography>
              <IconButton color="error" onClick={() => handleDelete(item.id)}>
                <DeleteIcon />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function App() {
  return (
    <Router>
      <Box>
        <ButtonAppBar />
        <Routes>
          <Route path="/cart" element={<Cart />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/" element={<UserManagement />} />
        </Routes>
      </Box>
    </Router>
  );
}

function Employee() {
  const navigate = useNavigate();
  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4">Employee Page</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>Back</Button>
    </Container>
  );
}

function Customer() {
  const navigate = useNavigate();
  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4">Customer Page</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>Back</Button>
    </Container>
  );
}

function UserManagement() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    fetch("https://reqres.in/api/users?page=2")
      .then((res) => res.json())
      .then((data) => setLoginHistory(data.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", backgroundColor: "#f4f4f4", p: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Card sx={{ p: 3, textAlign: "center", width: "50%", minHeight: "400px" }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <TextField fullWidth margin="normal" label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <TextField fullWidth margin="normal" label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Login History</Typography>
        <Box sx={{ maxHeight: 230, overflowY: "auto", p: 1 }}>
          {loginHistory.map((user) => (
            <Grid container key={user.id} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography>{user.first_name} {user.last_name} - ID: {user.id}</Typography>
            </Grid>
          ))}
        </Box>
      </Card>
    </Container>
  );
}

export default App;
