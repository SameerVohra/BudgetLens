import React, { useState } from 'react';
import ErrorPopup from './ErrorPopup';
import axios from 'axios';
import { useNavigate } from 'react-router';

function Register() {
  const [err, setErr] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [conPassword, setConPassword] = useState<string>("");

  const url = import.meta.env.VITE_URL;
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Client-side validation
    if (email.trim() === "" || password.trim() === "" || conPassword.trim() === "") {
      setShowPopup(true);
      setErr("All fields are required.");
      return;
    }

    if (password !== conPassword) {
      setShowPopup(true);
      setErr("Password and Confirm Password do not match.");
      return;
    }

    const register = async () => {
      try {
        setErr('');
        setShowPopup(false);

        const res = await axios.post(`${url}/register`, { email, pass: password });

        if (res.status === 201) {
          navigate(`/`);
        } else {
          setShowPopup(true);
          setErr("An unexpected error occurred. Please try again.");
        }
      } catch (error) {
        // Handling Axios errors
        if (axios.isAxiosError(error)) {
          const serverMessage = error.response?.data;
          setErr(serverMessage);
        } else {
          // Handling non-Axios errors
          setErr("An unexpected error occurred. Please check your connection and try again.");
        }
        setShowPopup(true);
      }
    };

    register();
  };

  return (
    <>
      {/* Error Popup */}

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
            <p className="text-gray-600 rotate-[0.5deg] ml-2">Join us and start tracking today!</p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 border-b-2 border-black">
            <button className="flex-1 pb-2 text-lg font-semibold text-gray-500 hover:text-black transition-colors" onClick={() => navigate("/")}>
              Login
            </button>
            <button className="flex-1 pb-2 text-lg font-semibold border-b-4 border-black -mb-0.5">
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form className="space-y-6 rotate-[0.3deg]" onSubmit={handleRegister}>

            <div className="space-y-2">
              <label className="block font-medium rotate-[0.5deg]" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border-2 border-black bg-[#f8f7f1] rotate-[0.2deg]
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium -rotate-[0.5deg]" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border-2 border-black bg-[#f8f7f1] rotate-[0.3deg]
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="At least 8 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium rotate-[0.3deg]" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-2 border-2 border-black bg-[#f8f7f1] -rotate-[0.2deg]
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Re-enter your password"
                required
                value={conPassword}
                onChange={(e) => setConPassword(e.currentTarget.value)}
              />
            </div>

            <div className="flex items-start gap-2 rotate-[-0.5deg]">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 border-2 border-black rounded-sm bg-[#f8f7f1]
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <label className="text-sm text-gray-600" htmlFor="terms">
                I agree to the{" "}
                <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-4 text-lg font-bold text-white bg-blue-500 border-2 border-black
              hover:bg-blue-600 active:translate-y-0.5 transition-transform rotate-[0.5deg]
              before:absolute before:inset-0 before:border-2 before:border-black before:rotate-[-1deg] before:-z-10
              relative"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>

    </>
  );
}

export default Register;
