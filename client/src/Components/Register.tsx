import React, { useState } from 'react';
import LoginRegisterBTN from './LoginRegisterBTN';
import ErrorPopup from './ErrorPopup';
import axios from 'axios';
import { useNavigate } from 'react-router';

function Register() {
  const [err, setErr] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const url = import.meta.env.VITE_URL;
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      setShowPopup(true);
      setErr("All the fields are required");
      return;
    }
    const register = async () => {
      try {
        setErr('');
        setShowPopup(false);
        const res = await axios.post(`${url}/register`, { email, pass: password });
        if (res.status === 201) {
          navigate(`/`)
        }

        console.log(res.data);

      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          console.log('hello')
          setShowPopup(true);
          setErr(error.response?.data);
        }
      }
    }
    register();

  };

  return (
    <>
      <div className="min-h-screen w-full flex justify-center items-center flex-col bg-gray-200 px-4">
        {showPopup && err && (
          <ErrorPopup error={err} className="fixed top-0 right-0 z-50 m-5" />
        )}
        <form
          onSubmit={handleRegister}
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
            Register
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
