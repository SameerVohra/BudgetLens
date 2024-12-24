import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import ErrorPopup from './ErrorPopup';

function Login() {
  const url = import.meta.env.VITE_URL;
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [err, setErr] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr('');
    setShowPopup(false);

    const login = async () => {
      if (email.trim() === "" || password.trim() === "") {
        setErr("All the fields are required");
        setShowPopup(true);
        return;
      }
      try {
        const res = await axios.post<{ token: string, uId: string }>(`${url}/login`, {
          email,
          pass: password,
        });
        if (res.status === 200) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem("email", email)
          navigate(`/home?id=${res.data.uId}`);
        }
      } catch (error) {
        setShowPopup(true);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setErr("Invalid credentials. Please try again.");
          } else if (error.response?.status === 500) {
            setErr("Server error. Please try again later.");
          } else {
            setErr("An unexpected error occurred. Please try again.");
          }
        } else {
          setErr("Unable to connect to the server. Please check your internet connection.");
        }
        console.error(error);
      }
    };

    login();
  };

  setTimeout(() => {
    setShowPopup(false);
  }, 8000);

  return (
    <div className="min-h-screen bg-[#f8f7f1] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-black rotate-[0.5deg] p-6 relative
        before:absolute before:inset-0 before:border-2 before:border-black before:rotate-[-1deg] before:-z-10
        after:absolute after:inset-0 after:border-2 after:border-black after:rotate-[1deg] after:-z-20">

        {showPopup && <ErrorPopup error={err} />}
        {/* Header */}
        <div className="mb-8 -rotate-[1deg]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 border-2 border-black bg-yellow-200 rotate-3 flex items-center justify-center">
              <span className="text-2xl font-bold -rotate-3">$</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              BudgetLens
            </h1>
          </div>
          <p className="text-gray-600 rotate-[0.5deg] ml-2">Track your money, achieve your dreams</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b-2 border-black">
          <button className="flex-1 pb-2 text-lg font-semibold border-b-4 border-black -mb-0.5">
            Login
          </button>
          <button className="flex-1 pb-2 text-lg font-semibold text-gray-500 hover:text-black transition-colors" onClick={() => navigate("/sign-up")}>
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="space-y-6 rotate-[0.3deg]" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="block font-medium -rotate-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border-2 border-black bg-[#f8f7f1] rotate-[0.5deg]
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium rotate-[0.5deg]" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border-2 border-black bg-[#f8f7f1] -rotate-[0.3deg]
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </div>


          <button
            type="submit"
            className="w-full py-2 mt-4 text-lg font-bold text-white bg-blue-500 border-2 border-black
              hover:bg-blue-600 active:translate-y-0.5 transition-transform rotate-[0.5deg]
              before:absolute before:inset-0 before:border-2 before:border-black before:rotate-[-1deg] before:-z-10
              relative"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
