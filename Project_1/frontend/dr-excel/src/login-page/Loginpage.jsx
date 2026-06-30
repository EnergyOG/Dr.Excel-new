import background from "/login-background.png"

function Loginpage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white/80 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <p className="text-lg font-semibold text-slate-800">This is the login page</p>
      </div>
    </div>
  )
}

export default Loginpage
