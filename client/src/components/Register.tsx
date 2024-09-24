import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import link from "../assets/link.json";
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${link.url}/register`, {
        name,
        password,
        uId: uuidv4(),
      });
      if (res.status === 200) {
        navigate("/");
      } else {
        setError("Registration failed. Try again.");
      }
    } catch (err) {
      setError("An error occurred during registration.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-600 via-blue-600 to-purple-600">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Create Account</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            className="mb-4"
            InputProps={{
              style: {
                fontSize: '1rem',
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: '1rem',
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            className="mb-4"
            InputProps={{
              style: {
                fontSize: '1rem',
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: '1rem',
              },
            }}
          />
          <Button
            variant="contained"
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white py-3 text-lg rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} className="text-white" /> : "Register"}
          </Button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-500 hover:underline cursor-pointer hover:text-blue-700 transition-colors duration-300"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
