import { useLocation, useNavigate } from "react-router";

function LoginRegisterBTN() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  return (
    <>
      <div className='border-black border-2 min-w-1/2 flex justify-center items-center space-x-2 py-3 px-5 rounded-full'>
        <button className={`text-black font-semibold rounded-2xl p-3 ${pathName === "/" ? "bg-gray-200" : ""}`} onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}>LOGIN</button>
        <button className={`text-black font-semibold rounded-2xl p-3 ${pathName === "/sign-up" ? "bg-gray-200" : ""}`} onClick={(e) => {
          e.preventDefault();
          navigate("/sign-up")
        }}>SIGN UP</button>
      </div>
    </>
  )
}

export default LoginRegisterBTN
