import React, { useState } from 'react';
import axios from 'axios';
import ErrorPopup from './ErrorPopup';
import LoginRegisterBTN from './LoginRegisterBTN.tsx';
import { useNavigate } from 'react-router';

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
          navigate(`/home?id=${res.data.uId}`);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setShowPopup(true);
          setErr(error.response?.data);
          console.log(error.response);
        }
      }
    };

    login();
  };

  setTimeout(() => {
    setShowPopup(false);
  }, 8000);

  return (
    <>
      <div className="min-h-screen w-full flex justify-center items-center flex-col bg-gray-200 px-4">
        {showPopup && err && (
          <ErrorPopup error={err} className="fixed top-0 right-0 z-50 m-5" />
        )}
        <form
          onSubmit={handleLogin}
          className="flex flex-col justify-center items-center border-2 border-black p-5 w-full max-w-sm space-y-5 rounded-2xl bg-white md:max-w-md lg:max-w-lg"
        >
          <LoginRegisterBTN />
          <input
            type="text"
            onChange={(e) => setEmail(e.currentTarget.value)}
            value={email}
            placeholder="Email"
            className="border-2 border-black p-2 rounded-xl w-full text-sm md:text-base"
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.currentTarget.value)}
            value={password}
            placeholder="Password"
            className="border-2 border-black p-2 rounded-xl w-full text-sm md:text-base"
          />
          <button
            type="submit"
            className="border-2 border-black p-3 rounded-2xl text-base font-bold w-full hover:shadow-black hover:shadow-2xl hover:bg-black hover:text-white md:text-lg lg:text-xl"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
