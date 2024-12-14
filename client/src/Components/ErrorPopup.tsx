interface ErrorI {
  error: string;
  className?: string;
}

function ErrorPopup({ error, className }: ErrorI) {
  return (
    <>
      <div className="min-w-full flex justify-end items-end p-5">
        <div className={` ${className} border-2 border-red-400 p-5 rounded-xl bg-red-400 text-white font-bold shadow-xl shadow-black `}>
          <h1>{error}!!</h1>
        </div>
      </div>

    </>
  )
}

export default ErrorPopup
