interface SuccessI {
  msg: string;
  className?: string;
}

function SuccessPopup({ msg, className }: SuccessI) {
  return (
    <>
      <div className="min-w-full flex justify-end items-end p-5">
        <div className={` ${className} border-2 border-green-400 p-5 rounded-xl bg-green-500 text-white font-bold shadow-xl shadow-black `}> 
          <h1>{msg}👍</h1>
        </div>
      </div>

    </>
  )
}

export default SuccessPopup
