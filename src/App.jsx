import { useState, useEffect, createContext, useContext } from "react";
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, Typography, Button, Container, TextField, Card, Grid, IconButton } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create Authentication Context
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// Navigation Bar
function ButtonAppBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>User Management</Typography>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/cart">
              <ShoppingCartIcon sx={{ mr: 1 }} /> Shopping Cart
            </Button>
            <Button color="inherit" onClick={() => { logout(); navigate("/login"); }}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Registration Page
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (email && password) {
      localStorage.setItem("authUser", JSON.stringify({ email, password }));
      toast.success("Registration successful!");
      navigate("/login");
    } else {
      toast.error("Please fill in all fields");
    }
  };

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Card sx={{ p: 3, textAlign: "center", width: "50%", mx: "auto" }}>
        <Typography variant="h5">Register</Typography>
        <TextField fullWidth margin="normal" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth margin="normal" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleRegister}>Register</Button>
      </Card>
    </Container>
  );
}

// Login Page
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem("authUser"));

    if (storedUser && storedUser.email === email && storedUser.password === password) {
      login(storedUser);
      toast.success("Login successful!");
      navigate("/cart");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Card sx={{ p: 3, textAlign: "center", width: "50%", mx: "auto" }}>
        <Typography variant="h5">Login</Typography>
        <TextField fullWidth margin="normal" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth margin="normal" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>Login</Button>
      </Card>
    </Container>
  );
}

// Protected Route Wrapper
function ProtectedRoute({ element }) {
  const { user } = useAuth();
  return user ? element : <Login />;
}

// Shopping Cart Page
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
      <ToastContainer position="top-right" autoClose={3000} />
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => navigate("/")}>Back</Button>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <Grid container spacing={2}>
        {cart.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <img src={item.image} alt={item.title} style={{ width: '100px', height: '100px' }} />
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="body2">Rs.{item.price}</Typography>
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

// App Component with Routing
function App() {
  return (
    <AuthProvider>
      <Router>
        <Box>
          <ButtonAppBar />
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
          </Routes>
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;
