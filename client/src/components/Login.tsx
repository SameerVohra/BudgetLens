import { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import link from "../assets/link.json"
import { useNavigate } from 'react-router-dom';

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${link.url}/login`, { name, password });
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("uId", res.data.uId);
        navigate(`/home/${res.data.uId}`);
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-blue-800 to-cyan-900">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            className="mb-4"
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            className="mb-4"
          />
          <Button
            variant="contained"
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} className="text-white" /> : "Login"}
          </Button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          New User?{" "}
          <span 
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login;
